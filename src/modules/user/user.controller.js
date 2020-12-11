const url = require('url');
const { UserService } = require('./user.service');

async function getUser (req, res, next) {
    const {status, data, err} = await UserService.getUser(req.params.userId);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function getUserByDetails (req, res, next) {
    const {status, data, err} = await UserService.verifyToken(req.body);
    if(status === 0) res.status(500).send(err);
    res.send({status, data});
};

async function saveUser (req, res, next) {
    const {status, data, err} = await UserService.saveUser(req.body);
    if(status === 0) res.status(500).send(err);
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
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function fetchUsersByInstructor (req, res, next) {
    const {status, data, err} = await UserService.fetchUsersByInstructor(req.params.userId);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function createUserBelongsToInstructor (req, res, next) {
    const {status, data, err} = await UserService.createUserBelongsToInstructor(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function createGuestUserGroup (req, res, next) {
    const {status, data, err} = await UserService.createGuestUserGroup(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function updateUserToGroup (req, res, next) {
    const {status, data, err} = await UserService.updateUsersToGroup(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function getUserGroups (req, res, next) {
    const {status, data, err} = await UserService.getUsersGroup(req.params.userId);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function getCourses(req, res, next) {
    const {status, data, err} = await UserService.getCourses();
    if(status === 0) res.status(500).send(err);
    res.send(data);
}

export async function forgotPassword (req, res, next) {
    const {status, data, err} = await UserService.forgotPassword(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function resetPassword (req, res, next) {
    const {status, data, err} = await UserService.resetPassword(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function changePassword (req, res, next) {
    const {status, data, err} = await UserService.changePassword(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function verifyAccount (req, res, next) {
    const {status, data, err} = await UserService.verifyAccount(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function resendOtp (req, res, next) {
    const {status, data, err} = await UserService.resendOtpForVerification(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function saveUserWithDeviceId(req, res, next) {
    const {status, data, err} = await UserService.saveUserWithDeviceId(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
}

export async function getNotifications (req, res, next) {
    // res.send([]);
    if(req.params.critical) {
        res.send(['If any issue persists, please logout and login again. Ignore if none.']);
    } else if(req.params.info) {
        res.send(['New version(0.0.6) is live now. Please update. Ignore if already updated.']);
    }
    // const {status, data, err} = await UserService.fetchUsersByInstructor(req.params.userId);
    // if(status === 0) res.status(500).send(err);
    // res.send(data);
};

export {
    getUser, saveUser, authenticateUser,
    createUserBelongsToInstructor, fetchUsersByInstructor,
    createGuestUserGroup, updateUserToGroup,
    getUserGroups, getUserByDetails
};