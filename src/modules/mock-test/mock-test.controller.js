import { MockTestService } from './mock-test.service';

async function getTestById (req, res, next) {
    const {status, data, err} = await MockTestService.getMockTestById(req.params.testId);
    if(status === 0) return next(err);
    res.send(data);
};

async function getTestByCourse (req, res, next) {
    const {status, data, err} = await MockTestService.getMockTestByCourse(req.params.course);
    if(status === 0) return next(err);
    res.send(data);
};

async function getTests (req, res, next) {
    const {status, data, err} = await MockTestService.getMockTests();
    if(status === 0) return next(err);
    res.send(data);
};

async function createTest (req, res, next) {
    const {status, data, err} = await MockTestService.createMockTest(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function updateTest (req, res, next) {
    const {status, data, err} = await MockTestService.updateMockTest(req.params.testId, req.body);
    if(status === 0) return next(err);
    res.send(data);
};

export {
    getTestById,
    getTestByCourse,
    getTests,
    createTest,
    updateTest
}