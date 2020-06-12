import { QuestionService } from './question.service';

async function getQuestion (req, res, next) {
    const {status, data, err} = await QuestionService.getQuestionById(req.params.questionId);
    if(status === 0) return next(err);
    res.send(data);
};

async function createQuestion (req, res, next) {
    const {status, data, err} = await QuestionService.createQuestion(req.body);
    if(status === 0) return next(err);
    res.send(data);
};

async function uploadQuestions (req, res, next) {
    const uploadResult = await QuestionService.uploadQuestions(req.body);
    res.send(uploadResult);
};

export { getQuestion, createQuestion, uploadQuestions };
