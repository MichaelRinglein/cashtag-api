const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Restaurant = db.Restaurant;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ restaurantname, password }) {
    const restaurant = await Restaurant.findOne({ restaurantname });
    if (restaurant && bcrypt.compareSync(password, restaurant.hash)) {
        const { hash, ...restaurantWithoutHash } = restaurant.toObject();
        const token = jwt.sign({ sub: restaurant.id }, config.secret);
        return {
            ...restaurantWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await Restaurant.find().select('-hash');
}

async function getById(id) {
    return await Restaurant.findById(id).select('-hash');
}

async function create(restaurantParam) {
    // validate
    if (await Restaurant.findOne({ restaurantname: restaurantParam.restaurantname })) {
        throw 'Restaurantname "' + restaurantParam.restaurantname + '" is already taken';
    }

    const restaurant = new Restaurant(restaurantParam);

    // hash password
    if (restaurantParam.password) {
        restaurant.hash = bcrypt.hashSync(restaurantParam.password, 10);
    }

    // save restaurant
    await restaurant.save();
}

async function update(id, restaurantParam) {
    const restaurant = await Restaurant.findById(id);

    // validate
    if (!restaurant) throw 'Restaurant not found';
    if (restaurant.restaurantname !== restaurantParam.restaurantname && await Restaurant.findOne({ restaurantname: restaurantParam.restaurantname })) {
        throw 'Restaurantname "' + restaurantParam.restaurantname + '" is already taken';
    }

    // hash password if it was entered
    if (restaurantParam.password) {
        restaurantParam.hash = bcrypt.hashSync(restaurantParam.password, 10);
    }

    // copy restaurantParam properties to restaurant
    Object.assign(restaurant, restaurantParam);

    await restaurant.save();
}

async function _delete(id) {
    await Restaurant.findByIdAndRemove(id);
}
