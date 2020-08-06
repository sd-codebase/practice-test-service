import { TestModel as Test} from './test.model';
import { QuestionService } from '../question/question.service';
import { MockTestService } from '../mock-test/mock-test.service';

export class TestService {
    static async getTest(testId) {
        try {
            let test = await Test.findOne({'_id': testId}).exec();
            if(test && test.isPredefined){
                test = test.toJSON();
                let res = await QuestionService.getQuestionsByIdIn(test.questionIds);
                let questions = res.data.map( question => question.toJSON());
                questions.forEach(question => {
                    question.id=question._id;
                });
                test.questions = questions;
            } else if (test.status === 0) {
                test = test.toJSON();
                test.questions.forEach(que => {
                    delete que.answer;
                    delete que.level;
                    delete que.createdAt;
                    delete que.answerDescription;
                    delete que.chapter;
                    delete que.verifiedBy;
                    delete que.isVerified;
                    delete que.noOfAnswers;
                    delete que.tags;
                });
            }
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
    
    static async getPredefinedTests() {
        try {
            let tests = await Test.find({'isPredefined': true}).exec();
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

    static async uploadPredefinedTest({testmeta, questions, userId}) {
        try{
            let test = await Test.findOne({'testName': testmeta.name}).exec();
            const uploadResult = [];
            for(let i=0; i<questions.length; i++) {
                questions[i].sortOrder = i;
                uploadResult.push(await QuestionService.createQuestion(questions[i], userId));
            }
            let questionIds = uploadResult.map(res => res.data._id);
            
            if(!test) {
                const test = new Test({
                    questionIds,
                    questionCount: questions.length,
                    testName: testmeta.name,
                    isPredefined: true,
                    status: 2,
                    isSubmitted: true
                });
                let testDoc = await test.save();
                testDoc = testDoc.toJSON();
                testDoc.questions.forEach( que => delete que.answer);
                return {
                    status: 1,
                    data: testDoc
                };
            } else {
                test = await Test.findOneAndUpdate({'testName': testmeta.name}, { questionIds }, {
                    new: true
                });
                test = test.toJSON();
                test.questions.forEach( que => delete que.answer);
                return {
                    status: 1,
                    data: test
                };
            }
        } catch(err){
            return {
                status: 0,
                err
            }
        }
    }

    static getQuestionNumbersListOfSection(section) {
        const list = [];
        section.blocks.forEach( block => {
            let from = Number(block.questionNumberFrom);
            let to = Number(block.questionNumberTo);
            while(from <= to) {
                list.push(from);
                from++;
            }
        })
        return list;
    }

    static getAllottedTime(testConfig) {
        let timeInMinutes = 0;
        testConfig.sections.forEach( sec => {
            timeInMinutes = timeInMinutes + (Number(sec.minutesToEachQuestion) * TestService.getQuestionNumbersListOfSection(sec).length);
        });
        return timeInMinutes * 60;
    }

    // Create Mock Test
    static async createMockTest({userId, testCriteria}) {
        try{
            let {data: testConfig} = await MockTestService.getMockTestById(testCriteria.testConfigId);
            testConfig = testConfig.toJSON();
            if(testConfig.type != 0) {
                throw {message: "No configuration found"};
            }
            return await TestService.createTestUsingConfig(userId, testConfig);
        } catch(err) {
            return {
                status: 0,
                err
            }
        }
    }

    static async createTestUsingConfig(userId, testConfig) {
        try{
            let {data: questions} = await QuestionService.getQuestionsBySectionCriteria(testConfig.sections, testConfig.course);
            questions = questions.map( (question, index) => {
                //question = question.toJSON();
                question.sortOrder = index+1;
                question.id = question._id;
                return question;
            });
            const instructions = {};
            testConfig.sections.forEach( section => {
                instructions[section.sectionName] = {
                    questions: TestService.getQuestionNumbersListOfSection(section),
                    instruction: section.instructions
                };
            });
            const test = new Test({
                userId,
                testConfigId: testConfig._id,
                questions,
                questionCount: testConfig.noOfQuestions,
                testName: testConfig.paperName,
                instructions: instructions,
                allottedTime: TestService.getAllottedTime(testConfig),
            });
            let testDoc = await test.save();
            testDoc = testDoc.toJSON();
            testDoc.questions.forEach( que => {
                delete que.answer;
                delete que.level;
                delete que.createdAt;
                delete que.answerDescription;
                delete que.chapter;
                delete que.verifiedBy;
                delete que.isVerified;
                delete que.noOfAnswers;
                delete que.tags;
            });
            return {
                status: 1,
                data: testDoc
            };
        } catch(err) {
            return {
                status: 0,
                err
            }
        }
    }

    static async createTest({userId, testCriteria}) {
        try{
            let {data: testConfig} = await MockTestService.getMockTestByQuery({course: testCriteria.course, type: testCriteria.type});
            testConfig = testConfig.toJSON();
            switch(testConfig.type) {
                case 1:
                    testConfig.sections[0].subject = testCriteria.subject;
                    testConfig.testName = testCriteria.subject;
                    break;
                case 2:
                    testConfig.sections[0].subject = testCriteria.subject;
                    testConfig.sections[0].blocks[0].chapters = [testCriteria.chapter];
                    testConfig.testName = testCriteria.chapter;
                    break;
                case 3:
                    testConfig.sections[0].subject = testCriteria.subject;
                    testConfig.sections[0].blocks[0].chapters = [testCriteria.chapter];
                    testConfig.sections[0].blocks[0].topics = [testCriteria.topic];
                    testConfig.testName = testCriteria.topic;
                    break;    
            }
            return await TestService.createTestUsingConfig(userId, testConfig);
        } catch(err) {
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
            await Test.updateOne({'_id': id}, {$set:test}).exec();
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
