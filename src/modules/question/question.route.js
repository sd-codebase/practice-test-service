import express from '../../lib/express.lib';
import * as Question from './question.controller';

const QuestionRoutes = express.Router();


QuestionRoutes.get('/', Question.getQuestions);
QuestionRoutes.get('/:questionId', Question.getQuestion);
QuestionRoutes.get('/answer/:questionId', Question.getAnswer);
QuestionRoutes.post('/matching-question', Question.getMatchingQuestion);
QuestionRoutes.post('/', Question.createQuestion);
QuestionRoutes.post('/import', Question.uploadQuestions);
QuestionRoutes.post('/verify', Question.verifyQuestion);
QuestionRoutes.post('/verify-update', Question.updateAndVerifyQuestion);

export { QuestionRoutes };