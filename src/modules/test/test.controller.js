import { TestService } from './test.service';
const url = require('url');

async function getTest (req, res, next) {
    const {status, data, err} = await TestService.getTest(req.params.testId);
    if(status === 0) return next(err);
    res.send(data);
};

async function getTests (req, res, next) {
    const queryObject = url.parse(req.url,true).query;
    const {status, data, err} = await TestService.getTests(queryObject);
    if(status === 0) return next(err);
    res.send(data);
};

async function getPerdefinedTests (req, res, next) {
    const {status, data, err} = await TestService.getPredefinedTests();
    if(status === 0) return next(err);
    res.send(data);
};

async function createTest (req, res, next) {
    const {status, data, err} = await TestService.createTest(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function uploadPredefinedTest (req, res, next) {
    const {status, data, err} = await TestService.uploadPredefinedTest(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function updateTest (req, res, next) {
    const {status, data, err} = await TestService.updateTest(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function deleteTest (req, res, next) {
    const {status, data, err} = await TestService.deleteTest(req.params.testId);
    if(status === 0) return next(err);
    res.send(data);
};

export { getTests, getTest, createTest, updateTest, deleteTest, uploadPredefinedTest, getPerdefinedTests };
