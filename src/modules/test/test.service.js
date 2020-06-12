import { TestModel as Test} from './test.model';
import { QuestionService } from '../question/question.service';

export class TestService {
    static async getTest(testId) {
        try {
            let test = await Test.findOne({'_id': testId}).exec();
            const {data: questions} = await QuestionService.getQuestionsByIdIn(test.questionsIds);
            test = test.toJSON();
            test.questions = questions;
            return {
                status: 1,
                data: test
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async createTest({userId}) {
        try{
            const {data:questions} = await QuestionService.getRandomQuestions(20);
            const test = new Test({
                userId,
                questions,
                chapter: questions[0].chapter,
                questionCount: questions.length
            });
            let testDoc = await test.save();
            return {
                status: 1,
                data: testDoc
            };
        } catch(err){
            return {
                status: 0,
                err
            }
        }

    }

    static async updateTest(test) {
        try{
            const id = test._id;
            delete test._id;
            await Test.updateOne({'_id': id}, test).exec();
            const testRes = await TestService.getTest(id);
            return testRes;
        } catch(err){
            return {
                status: 0,
                err
            }
        }

    }
}
