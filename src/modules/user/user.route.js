import express from '../../lib/express.lib';
import * as User from './user.controller';

const UserRoutes = express.Router();


// a simple test url to check that all of our files are communicating correctly.
UserRoutes.get('/:userId', User.getUser);
UserRoutes.post('/', User.saveUser);
UserRoutes.get('/fetch-guests/:userId', User.fetchUsersByInstructor);
UserRoutes.post('/add-guests', User.createUserBelongsToInstructor);
UserRoutes.post('/authenticate', User.authenticateUser);

export { UserRoutes };