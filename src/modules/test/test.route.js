import express from '../../lib/express.lib';
import * as Test from './test.controller';

const TestRoutes = express.Router();


// a simple test url to check that all of our files are communicating correctly.
TestRoutes.get('/all', Test.getTests);
TestRoutes.get('/solved-papers', Test.getPerdefinedTests);
TestRoutes.get('/:testId', Test.getTest);
TestRoutes.delete('/:testId', Test.deleteTest);
TestRoutes.post('/', Test.createTest);
TestRoutes.post('/create-predefined-test', Test.uploadPredefinedTest);
TestRoutes.post('/create-mock-test', Test.createMockTest);
TestRoutes.put('/', Test.updateTest);

export { TestRoutes };