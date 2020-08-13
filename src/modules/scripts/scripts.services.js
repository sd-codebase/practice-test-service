import { QuestionModel } from '../question/question.model';
import { COURSES } from '../test/test.model';

export class ScriptService {
    static async updateNoOfAnswers() {
        try {
            const results = [];
            const questions = await QuestionModel.find({}).exec();
            for (const question of questions) {
                if ((question.answer.includes('a') || question.answer.includes('b') || question.answer.includes('c') || question.answer.includes('d')) && question.answer.toLowerCase() !== 'bonus') {
                    const noOfAnswers = question.answer.split(',').length;
                    const result = await QuestionModel.updateOne({'_id': question._id}, {$set:{ noOfAnswers: noOfAnswers}}).exec();
                    results.push(result);
                }
            }
            return results;
        } catch (err){
            return err;
        }
    }

    static async updateCourses() {
        try {
            const results = [];
            const JEESubjects = ['Physics', 'Chemistry', 'Mathematics'];
            const NEETSubjects = ['Physics', 'Chemistry', 'Biology'];
            const questions = await QuestionModel.find({}).exec();
            for (const question of questions) {
                let courses = [];
                if (JEESubjects.includes(question.chapter.subject)) {

                    courses = [COURSES.JEE_MAINS, COURSES.JEE_ADV_PAPER_1, COURSES.JEE_ADV_PAPER_2];
                }
                if (NEETSubjects.includes(question.chapter.subject)) {
                    courses.push(COURSES.NEET);
                }
                const result = await QuestionModel.updateOne({'_id': question._id}, {$set:{ 'chapter.course': courses}}).exec();
                results.push(result);
            }
            return results;
        } catch (err){
            return err;
        }
    }
}