import { TestModel as Test} from './test.model';
import { QuestionService } from '../question/question.service';
import { MockTestService } from '../mock-test/mock-test.service';
import { isEqual } from 'lodash';

export class TestService {
    static async getTest(testId) {
        try {
            let test = await Test.findOne({'_id': testId}).exec();
            test = test.toJSON();
            if(test && test.isPredefined){
                let res = await QuestionService.getQuestionsByIdIn(test.questionIds);
                let questions = res.data.map( question => question.toJSON());
                questions.forEach(question => {
                    question.id=question._id;
                });
                test.questions = questions;
            } else if (test.status === 0) {
                test.questions.forEach(que => {
                    delete que.answer;
                    delete que.level;
                    delete que.createdAt;
                    delete que.answerDescription;
                    delete que.verifiedBy;
                    delete que.isVerified;
                    delete que.noOfAnswers;
                    delete que.tags;
                });
            }
            if(test.hasParagraph) {
                const paras = await QuestionService.getParaInfos({paraId: {$in: test.paragraphs}});
                test.paraObject = paras.data;
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
            let paragraphs = [...new Set(uploadResult.map(res => res.data.infoPara))].filter( infoPara => infoPara);
            
            if(!test) {
                const test = new Test({
                    questionIds,
                    questionCount: questions.length,
                    testName: testmeta.name,
                    isPredefined: true,
                    status: 2,
                    isSubmitted: true,
                    paragraphs,
                    hasParagraph: paragraphs > 0,
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
            const myTests = await Test.countDocuments({status: 0, userId: userId}).exec();
            if(myTests >= 5) {
                throw {message: "5 or more tests are in progress, please complet or delete them."};
            }
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
            let paragraphs = [];
            questions = questions.map( (question, index) => {
                //question = question.toJSON();
                question.sortOrder = index+1;
                question.id = question._id;
                if(question.infoPara) {
                    paragraphs.push(question.infoPara);
                }
                return question;
            });
            if(paragraphs.length) {
                paragraphs = [...new Set(paragraphs)];
            }
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
                paragraphs,
                hasParagraph: paragraphs.length,
                totalMarks: testConfig.totalMarks,
            });
            let testDoc = await test.save();
            testDoc = testDoc.toJSON();
            testDoc.questions.forEach( que => {
                delete que.answer;
                delete que.level;
                delete que.createdAt;
                delete que.answerDescription;
                delete que.verifiedBy;
                delete que.isVerified;
                delete que.noOfAnswers;
                delete que.tags;
            });
            if(testDoc.hasParagraph) {
                const paras = await QuestionService.getParaInfos({paraId: {$in: testDoc.paragraphs}});
                testDoc.paraObject = paras.data;
            }
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
            const myTests = await Test.countDocuments({status: 0, userId: userId}).exec();
            if(myTests >= 5) {
                throw {message: "5 or more tests are in progress, please complet or delete them."};
            }
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
        let {data: testConfig} = await MockTestService.getMockTestById(test.testConfigId);
        const sectionList = [];
        testConfig.sections.forEach( section => {
            const sec = {...section};
            sec.blocks.forEach( block => {
                const childSec = {...sec, ...block};
                sectionList.push(childSec);
            });
        });

        for(let section of sectionList) {
            const queNums = [];
            let from = Number(section.questionNumberFrom);
            let to = Number(section.questionNumberTo);
            while(from <= to) {
                queNums.push(from);
                from++;
            }
            for(let queNum of queNums) {
                const question = test.questions.find( que => que.sortOrder === queNum);
                const {data: questionFromDb} = await QuestionService.getQuestionById(question.id);
                if(question.isSubmitted) {
                    TestService.calculateAnswers(testConfig.isNegativeMarking,section, question, questionFromDb);
                } else {
                    // necessary updates if needed
                }
                question.answer = questionFromDb.answer;
                question.answerDescription = questionFromDb.answerDescription;
            }
        }
        
        test.correctCount = test.questions.filter( que => que.isCorrectAnswer === CorrectAnswerType.CORRECT || que.isCorrectAnswer === CorrectAnswerType.PARTIAL ).length;
        test.result = TestResult.PASS;
        if(testConfig.isSectionwisePassing) {
            test.sectionWisePercentage = [];
            testConfig.sections.forEach( section => {
                const questionNums = TestService.getQuestionNumbersListOfSection(section);
                const positiveMarks = test.questions.filter( que => questionNums.includes(que.sortOrder)).reduce( (sum, que) => sum + (que.obtainedMarks ? Number(que.obtainedMarks) : 0), 0 );
                const negativeMarks = test.questions.filter( que => questionNums.includes(que.sortOrder)).reduce( (sum, que) => sum + (que.negativeMarks ? Number(que.negativeMarks) : 0), 0 );
                const totalObtained = positiveMarks - negativeMarks;
                const total = questionNums.length * section.marksToEachQuestion;
                const sectionPercent = Number((totalObtained / total * 100).toFixed(2));
                const sectionWisePercentage = {
                    section : section.sectionName,
                    percentage: sectionPercent,
                    requiredPercentage: section.passingPercentage
                }
                test.sectionWisePercentage.push(sectionWisePercentage);
                if (sectionPercent < section.passingPercentage) {
                    test.result = TestResult.FAIL;
                }
            });
        } else {
            const positiveMarks = test.questions.reduce( (sum, que) => sum + (que.obtainedMarks ? Number(que.obtainedMarks) : 0), 0 );
            const negativeMarks = test.questions.reduce( (sum, que) => sum + (que.negativeMarks ? Number(que.negativeMarks) : 0), 0 );
            const totalObtained = positiveMarks - negativeMarks;
            test.requiredPercentage = testConfig.passingPercentage;
            test.percentage = Number((totalObtained / testConfig.totalMarks * 100).toFixed(2));
            if (test.percentage < testConfig.passingPercentage) {
                test.result = TestResult.FAIL;
            }
        }
        return null;
    }

    static calculateAnswers(isNegativeMarking, section, question, questionFromDb) {
        switch(section.type) {
            case 0:
                TestService.calculateAnswersOfNumericAndOneOption(isNegativeMarking, section, question, questionFromDb);
                break;
            case 1:
                TestService.calculateAnswersOfNumericAndOneOption(isNegativeMarking, section, question, questionFromDb);
                break;
            default:
                TestService.calculateAnswersOfTwoOrMoreOptions(isNegativeMarking, section, question, questionFromDb);
                break;
        }
    }

    static calculateAnswersOfNumericAndOneOption(isNegativeMarking, section, question, questionFromDb) {
        if(question.userAnswer === questionFromDb.answer) {
            question.isCorrectAnswer = CorrectAnswerType.CORRECT;
            question.obtainedMarks = section.marksToEachQuestion;
            question.negativeMarks = 0;
        } else {
            question.isCorrectAnswer = CorrectAnswerType.WRONG;
            question.obtainedMarks = 0;
            question.negativeMarks = isNegativeMarking? section.negativeMarksToEachQuestion : 0;
        }
    }

    static calculateAnswersOfTwoOrMoreOptions(isNegativeMarking, section, question, questionFromDb) {
        const [userAnswer, answers] = [question.userAnswer.split(','), questionFromDb.answer.split(',')];
        const correctUserAnswer = userAnswer.filter(ans => answers.includes(ans));
        if(isEqual(userAnswer, answers)) {
            question.isCorrectAnswer = CorrectAnswerType.CORRECT;
            question.obtainedMarks = section.marksToEachQuestion;
            question.negativeMarks = 0;
        } else {
            if(section.isOptionwiseNegativeMarking) {
                let correctOptions = 0;
                let wrongOptions = 0;
                userAnswer.forEach( answer => {
                    if(answers.includes(answer)) {
                        correctOptions += 1;
                    } else {
                        wrongOptions += 1;
                    }
                });
                question.isCorrectAnswer = correctOptions ? CorrectAnswerType.PARTIAL : CorrectAnswerType.WRONG;
                question.obtainedMarks = correctUserAnswer.length;
                question.negativeMarks = isNegativeMarking ? wrongOptions : 0;
            } else {
                question.isCorrectAnswer = CorrectAnswerType.WRONG;
                question.obtainedMarks = 0;
                question.negativeMarks = isNegativeMarking ? section.negativeMarksToEachQuestion : 0;
            }
        }
    }
}

export const CorrectAnswerType = {
    CORRECT: 1,
    WRONG: 0,
    PARTIAL: 2,
};

export const TestResult = {
    PASS: 1,
    FAIL: 0,
};
