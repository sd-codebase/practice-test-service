import express from '../../lib/express.lib';
import * as MockTest from './mock-test.controller';

const MockTestRoutes = express.Router();


// a simple test url to check that all of our files are communicating correctly.
MockTestRoutes.get('/', MockTest.getTests);
MockTestRoutes.get('/:testId', MockTest.getTestById);
MockTestRoutes.get('/course/:course', MockTest.getTestByCourse);
MockTestRoutes.post('/', MockTest.createTest);
MockTestRoutes.put('/:testId', MockTest.updateTest);

export { MockTestRoutes }