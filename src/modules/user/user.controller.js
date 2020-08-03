const url = require('url');
const { UserService } = require('./user.service');

async function getUser (req, res, next) {
    const {status, data, err} = await UserService.getUser(req.params.userId);
    if(status === 0) return next(err);
    res.send(data);
};

async function fetchUsersByInstructor (req, res, next) {
    const {status, data, err} = await UserService.fetchUsersByInstructor(req.params.userId);
    if(status === 0) return next(err);
    res.send(data);
};

async function saveUser (req, res, next) {
    const {status, data, err} = await UserService.saveUser(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function createUserBelongsToInstructor (req, res, next) {
    const {status, data, err} = await UserService.createUserBelongsToInstructor(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function authenticateUser (req, res, next) {
    const {status, data, err} = await UserService.authenticateUser(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

export { getUser, saveUser, authenticateUser, createUserBelongsToInstructor, fetchUsersByInstructor};