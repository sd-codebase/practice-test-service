import express from '../../lib/express.lib';
import * as User from './user.controller';

const UserRoutes = express.Router();


// a simple test url to check that all of our files are communicating correctly.
UserRoutes.get('/notifications', (req, res) => { res.send(['This is critical message'])});

UserRoutes.post('/get-user-for-verification', User.getUserByDetails);
UserRoutes.get('/courses', User.getCourses);
UserRoutes.get('/:userId', User.getUser);
UserRoutes.post('/', User.saveUser);
UserRoutes.get('/fetch-guests/:userId', User.fetchUsersByInstructor);
UserRoutes.post('/add-guests', User.createUserBelongsToInstructor);
UserRoutes.post('/create-guest-user-group', User.createGuestUserGroup);
UserRoutes.post('/update-users-to-group', User.updateUserToGroup);
UserRoutes.get('/user-groups/:userId', User.getUserGroups);
UserRoutes.post('/authenticate', User.authenticateUser);
UserRoutes.post('/verify-account', User.verifyAccount);
UserRoutes.post('/resend-otp', User.resendOtp);

UserRoutes.put('/forgot-password', User.forgotPassword);
UserRoutes.put('/reset-password', User.resetPassword);
UserRoutes.put('/change-password', User.changePassword);

export { UserRoutes };