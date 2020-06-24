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

    static async deleteTest(testId) {
        try {
            let tests = await Test.deleteOne({'_id': testId}).exec();
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
            let {data:questions} = await QuestionService.getRandomQuestions(60);
            questions = questions.map( question => {
                question = question.toJSON();
                question.id = question._id;
                return question;
            });
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
            subittedQuestion.isCorrectAnswer = TestService.isCorrectAnswer(subittedQuestion, que);
        });
        test.correctCount = test.questions.filter( que => que.isCorrectAnswer).length;
        test.percentage = test.correctCount / test.questionCount * 100;
        return null;
    }

    static isCorrectAnswer(subittedQuestion, que) {
        let returnValue = false;
        if(!subittedQuestion.isSubmitted){
            return returnValue;
        } else if(subittedQuestion.question.statement.includes('*inputbox*')) {
            return subittedQuestion.userAnswer && que.answer.toString() == subittedQuestion.userAnswer.toString();
        } else if(que.isSingleAnswer){
            return que.answer.toString() === subittedQuestion.userAnswer.toString();
        } else {
            let [answer, userAnswer] = [que.answer, subittedQuestion.userAnswer];
            answer = answer.split(',');
            if (userAnswer && answer && userAnswer.length === answer.length) {
                return answer.every( opNum => userAnswer.includes(opNum) );
            } else{
                return false;
            }
        }
    }
}
