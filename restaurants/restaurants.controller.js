const express = require('express');
const router = express.Router();
const restaurantService = require('./restaurant.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function authenticate(req, res, next) {
    restaurantService.authenticate(req.body)
        .then(restaurant => restaurant ? res.json(restaurant) : res.status(400).json({ message: 'Restaurantname or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    restaurantService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    restaurantService.getAll()
        .then(restaurants => res.json(restaurants))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    restaurantService.getById(req.restaurant.sub)
        .then(restaurant => restaurant ? res.json(restaurant) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    restaurantService.getById(req.params.id)
        .then(restaurant => restaurant ? res.json(restaurant) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    restaurantService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    restaurantService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
