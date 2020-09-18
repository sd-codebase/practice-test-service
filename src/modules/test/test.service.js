import { TestModel as Test, GuestTestModel as GuestTest} from './test.model';
import { QuestionService } from '../question/question.service';
import { MockTestService } from '../mock-test/mock-test.service';
import { isEqual } from 'lodash';

export class TestService {
    static async getTest(testId, queryObject) {
        try {
            let test;
            if(queryObject && queryObject.isGuest) {
                test = await GuestTest.findOne({'_id': testId}).exec();
            } else {
                test = await Test.findOne({'_id': testId}).exec();
            }
            if (!test) {
                throw {message: 'No test found'};
            }
            test = test.toJSON();
            if(test && test.isPredefined){
                let res = await QuestionService.getQuestionsByIdIn(test.questionIds);
                let questions = res.data.map( question => question.toJSON());
                questions.sort((x, y) => {
                    return x.createdAt - y.createdAt;
                });
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
            let tests;
            if (query.isGuest) {
                delete query.isGuest;
                tests = await GuestTest.find(query).exec();
            } else {
                tests = await Test.find(query).exec();
            }
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
    
    static async getPredefinedTests(course) {
        try {
            let tests = await Test.find({'isPredefined': true, course: course}).exec();
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
            GuestTest.deleteMany({'mappedTestId': testId}).exec();
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

    static async uploadPredefinedTest({testmeta, questions, userId, course}) {
        try{
            let test = await Test.findOne({'testName': testmeta.name}).exec();
            let uploadResult = [];
            for(let i=0; i<questions.length; i++) {
                questions[i].sortOrder = i;
                uploadResult.push(QuestionService.createQuestion(questions[i], userId, course));
            }

            uploadResult = await Promise.all(uploadResult);

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
                    course
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
                hasParagraph: paragraphs.length ? true : false,
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

    static async updateTestUsers(test) {
        try{
            await Test.updateOne({'_id': test._id}, {$set:{users: test.users}}).exec();
            TestService.copyTestToGuestUsers(test._id);
            return {status: 1, message: "Users updated"};
        } catch(err){
            return {
                status: 0,
                err
            }
        }
    }

    static async copyTestToGuestUsers(testId) {
        let test = await Test.findById(testId);
        test = test.toJSON();
        const users = test.users;
        const mappedTestId = test._id;
        delete test._id;
        delete test.users;
        for(const guestUserId of users) {
            const guestTest = new GuestTest({
                testName: test.testName
            });
            guestTest.createdAt = new Date();
            guestTest.mappedTestId = mappedTestId;
            guestTest.guestUserId = guestUserId;
            const found = await GuestTest.findOne({mappedTestId, guestUserId}).exec();
            if (!found) {
                delete test.createdAt;
                test.updatedAt = new Date();
                const savedGuestTest = await guestTest.save();
                await GuestTest.updateOne({'_id': savedGuestTest._id}, {$set:test}).exec();
            }
        }
    }

    static async updateTest(test, queryObject) {
        try{
            await TestService.updateCorrectAnswer(test);
            const id = test._id;
            delete test._id;
            test.isSubmitted = true;
            test.updatedAt = Date.now();
            if(queryObject && queryObject.isGuest) {
                await GuestTest.updateOne({'_id': id}, {$set:test}).exec();
            } else {
                await Test.updateOne({'_id': id}, {$set:test}).exec();
            }
            const testRes = await TestService.getTest(id, queryObject);
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
                console.log(queNum, question)
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
        if(isEqual(userAnswer, answers)) {
            question.isCorrectAnswer = CorrectAnswerType.CORRECT;
            question.obtainedMarks = section.marksToEachQuestion;
            question.negativeMarks = 0;
        } else {
            if(section.isOptionwiseNegativeMarking) {
                let correctOptions = 0;
                userAnswer.forEach( answer => {
                    if(answers.includes(answer)) {
                        correctOptions += 1;
                    }
                });
                question.isCorrectAnswer = correctOptions ? CorrectAnswerType.PARTIAL : CorrectAnswerType.WRONG;
                question.obtainedMarks = answers.length === correctOptions? section.marksToEachQuestion : TestService.calculateMarksOfMultipleOptions(correctOptions, answers.length);
                question.negativeMarks = isNegativeMarking ? section.negativeMarksToEachQuestion : 0;
            } else {
                question.isCorrectAnswer = CorrectAnswerType.WRONG;
                question.obtainedMarks = 0;
                question.negativeMarks = isNegativeMarking ? section.negativeMarksToEachQuestion : 0;
            }
        }
    }

    static calculateMarksOfMultipleOptions(correctOptions, answersLength) {
        if(correctOptions === 0) {
            return 0;
        }
        if(answersLength === 2 || correctOptions === 1){
            return 2;
        } else if(answersLength === 3){
            return correctOptions;
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
