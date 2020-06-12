import { TestService } from './test.service';

async function getTest (req, res, next) {
    const {status, data, err} = await TestService.getTest(req.params.testId);
    if(status === 0) return next(err);
    res.send(data);
};

async function createTest (req, res, next) {
    const {status, data, err} = await TestService.createTest(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function updateTest (req, res, next) {
    const {status, data, err} = await TestService.updateTest(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

export { getTest, createTest, updateTest };
