import { TestModel as Test} from './test.model';
import { QuestionService } from '../question/question.service';

export class TestService {
    static async getTest(testId) {
        try {
            let test = await Test.findOne({'_id': testId}).exec();
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

    static async getTests(query) {
        try {
            let tests = await Test.find(query).exec();
            return {
                status: 1,
                data: tests
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
            testDoc = testDoc.toJSON();
            testDoc.questions.forEach( que => delete que.answer);
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
            await TestService.updateCorrectAnswer(test);
            const id = test._id;
            delete test._id;
            test.isSubmitted = true;
            test.updatedAt = Date.now();
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

    static async updateCorrectAnswer(test) {
        const {data: testFromDb} = await TestService.getTest(test._id);
        test.questions.forEach( (subittedQuestion, i) => {
            const que = testFromDb.questions[i];
            subittedQuestion.isCorrectAnswer = subittedQuestion.isSubmitted && (que.isSingleAnswer ? que.answer.toString() === subittedQuestion.userAnswer.toString()
            : TestService.isCorrectAnswer(que.answer, subittedQuestion.userAnswer));
        });
        test.correctCount = test.questions.filter( que => que.isCorrectAnswer).length;
        test.percentage = test.correctCount / test.questionCount * 100;
        return null;
    }

    static isCorrectAnswer(answer, userAnswer) {
        answer = answer.split(',').map( num => Number(num));
        if (userAnswer && answer && userAnswer.length === answer.length) {
            return answer.every( opNum => userAnswer.includes(opNum) );
        } else{
            return false;
        }
    }
}
