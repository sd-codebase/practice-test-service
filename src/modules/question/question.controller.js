import { QuestionService } from './question.service';

async function getQuestion (req, res, next) {
    const {status, data, err} = await QuestionService.getQuestionById(req.params.questionId);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function getMatchingQuestion (req, res, next) {
    const {status, data, err} = await QuestionService.getQuestion(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function getQuestions(req, res, next) {
    const {status, data, err} = await QuestionService.getQuestions(req.query);
    if(status === 0) res.status(500).send(err);
    res.send(data);
}

async function verifyQuestion(req, res, next) {
    const {status, data, err} = await QuestionService.verifyQuestion(req.body.questionId);
    if(status === 0) res.status(500).send(err);
    res.send(data);
}

async function createQuestion (req, res, next) {
    const {status, data, err} = await QuestionService.createQuestion(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function uploadQuestions (req, res, next) {
    const uploadResult = await QuestionService.uploadQuestions(req.body);
    res.send(uploadResult);
};

async function getAnswer (req, res, next) {
    const {status, data, err} = await QuestionService.getAnswer(req.params.questionId);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function updateAndVerifyQuestion(req, res, next) {
    const {status, data, err} = await QuestionService.updateAndVerifyQuestion(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
}

async function createInformationPara (req, res, next) {
    const {status, data, err} = await QuestionService.createInformationPara(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

async function updateInformationPara (req, res, next) {
    const {status, data, err} = await QuestionService.updateInformationPara(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function getInformationParas (req, res, next) {
    const {status, data, err} = await QuestionService.getParaInfos();
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function saveReportQuestions (req, res, next) {
    const {status, data, err} = await QuestionService.reportQuestions(req.body);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function updateSubjectOfQuestion (req, res, next) {
    const data = await QuestionService.updateSubjectOfQuestion(req.body);
    res.send(data);
};

export { 
    getQuestion, getQuestions, createQuestion,
    uploadQuestions, getAnswer, verifyQuestion,
    getMatchingQuestion, updateAndVerifyQuestion,
    createInformationPara, updateInformationPara
};
