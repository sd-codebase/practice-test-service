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

export async function getAppVersion(req, res, next) {
    const {status, data, err} = await UserService.getAppVersion();
    if(status === 0) res.status(500).send(err);
    res.send(data);
}

export async function getNotifications(req, res, next) {
    const queryObject = url.parse(req.url,true).query;
    // res.send([]);
    if(queryObject.critical) {
        res.send([
            // 'Emergency Downtime on Thursday 18 Feb from 00:30AM to 02:00AM. Strongly recommended to not use app.',
        ]);
    } else if(queryObject.info) {
        if (!queryObject.version || queryObject.version !== '0.0.8') {
            res.send([
                'New version(0.0.8) is live now. Please consider updating the app. We will stop services for v0.0.7 from 10th March.'
            ]);
        } else {
            res.send([
                // 'Downtime Ended: We are back again. Downtime Ended at 18 Feb@00:55AM. Thank you for your support.',
                // 'Downtime Ended. If you face any issue, please logout and login again. If problem still persists, write us at kslabs.care@gmail.com.',
                // 'New version(0.0.7) is live now. Please update. Ignore if already updated.'
            ]);
        }
    } else {
        res.send([]);
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