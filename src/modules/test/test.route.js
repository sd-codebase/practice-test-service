import express from '../../lib/express.lib';
import * as Test from './test.controller';

const TestRoutes = express.Router();


// a simple test url to check that all of our files are communicating correctly.
TestRoutes.get('/all', Test.getTests);
TestRoutes.get('/:testId', Test.getTest);
TestRoutes.post('/', Test.createTest);
TestRoutes.put('/', Test.updateTest);

export { TestRoutes };