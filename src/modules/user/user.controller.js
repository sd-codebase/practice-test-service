const url = require('url');
const { UserService } = require('./user.service');

async function getUser (req, res, next) {
    const {status, data, err} = await UserService.getUser(req.params.userId);
    if(status === 0) return next(err);
    res.send(data);
};

async function getUserByDetails (req, res, next) {
    const queryObject = url.parse(req.url,true).query;
    if (queryObject.isGuest) {
        const {status, data, err} = await UserService.getGuestUserByDetails(queryObject);
        if(status === 0) return next(err);
        res.send({status, data});
    } else {
        const {status, data, err} = await UserService.getUserByDetails(queryObject);
        if(status === 0) return next(err);
        res.send({status, data});
    }
};

async function saveUser (req, res, next) {
    const {status, data, err} = await UserService.saveUser(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function authenticateUser (req, res, next) {
    let user;
    if (req.body.userType === 'Guest') {
        user = await UserService.authenticateGuestUser(req.body);
    } else {
        user = await UserService.authenticateUser(req.body);
    }
    const {status, data, err} = user;
    if(status === 0) return next(err);
    res.send(data);
};

async function fetchUsersByInstructor (req, res, next) {
    const {status, data, err} = await UserService.fetchUsersByInstructor(req.params.userId);
    if(status === 0) return next(err);
    res.send(data);
};

async function createUserBelongsToInstructor (req, res, next) {
    const {status, data, err} = await UserService.createUserBelongsToInstructor(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function createGuestUserGroup (req, res, next) {
    const {status, data, err} = await UserService.createGuestUserGroup(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function updateUserToGroup (req, res, next) {
    const {status, data, err} = await UserService.updateUsersToGroup(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function getUserGroups (req, res, next) {
    const {status, data, err} = await UserService.getUsersGroup(req.params.userId);
    if(status === 0) return next(err);
    res.send(data);
};

export {
    getUser, saveUser, authenticateUser,
    createUserBelongsToInstructor, fetchUsersByInstructor,
    createGuestUserGroup, updateUserToGroup,
    getUserGroups, getUserByDetails
};