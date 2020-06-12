import express from '../../lib/express.lib';
import * as Question from './question.controller';

const QuestionRoutes = express.Router();


QuestionRoutes.get('/:questionId', Question.getQuestion);
QuestionRoutes.post('/', Question.createQuestion);
QuestionRoutes.post('/import', Question.uploadQuestions);

export { QuestionRoutes };