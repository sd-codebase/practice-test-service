import { QuestionModel } from '../question/question.model';

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
                    courses = ['JEE Mains', 'JEE Advanced I', 'JEE Advanced II'];
                }
                if (NEETSubjects.includes(question.chapter.subject)) {
                    courses.push('NEET');
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