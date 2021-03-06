import { QuestionModel } from '../question/question.model';
import { UserActivityModel } from '../user/user-activity.model';
import { TestModel } from '../test/test.model';
import { ChapterModel } from './../chapter/chapter.model';
import { COURSES } from '../test/test.model';

export class ScriptService {
    static async updateNoOfAnswers() {
        try {
            const results = [];
            const questions = await QuestionModel.find({}).exec();
            for (const question of questions) {
                if ((question.answer.toString().includes('a') || question.answer.toString().includes('b') || question.answer.toString().includes('c') || question.answer.toString().includes('d')) && question.answer.toString().toLowerCase() !== 'bonus') {
                    const noOfAnswers = question.answer.split(',').length;
                    const result = QuestionModel.updateOne({'_id': question._id}, {$set:{ noOfAnswers: noOfAnswers}}).exec();
                    results.push(result);
                }
            }
            await Promise.all(results);
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

    static async updateChapters() {
        try{
            // const questions = await QuestionModel.find({}).exec();
            // for (let que of questions) {
            //     await QuestionModel.updateOne({'_id': que._id}, {$set:{ 'chapter.topic': que.chapter.chapter}}).exec();
            // }          

            let chapters = await QuestionModel.find({}).distinct('chapter.topic').exec();
            chapters = chapters.filter( ch => ch);
            let promises = chapters.map( ch => QuestionModel.findOne({'chapter.topic': ch}).exec());
            let results = await Promise.all(promises);
            results = results.map(res => res.chapter);
            let finalTopics = [];
            for(let ob of results) {
                let topicsObjs = ob.courses.map( crs => {
                    return {
                        course: crs,
                        subject: ob.subject,
                        chapter: ob.chapter,
                        topic: ob.topic
                    }
                });
                finalTopics = [...finalTopics, ... topicsObjs];
            }
            for(let topic of finalTopics) {
                const savedTopic = await ChapterModel.findOne(topic).exec();
                if (!savedTopic) {
                    const newTopic = new ChapterModel(topic);
                    newTopic.save();
                }
            }
        } catch (err){
            console.log(err)
            return err;
        }
    }

    static async deleteInactiveUsersData() {
        try {
            const users = await UserActivityModel.find({"updatedAt": {"$lt": new Date("2021-01-01")}}, {"userId": 1, "_id": 0}).exec();
            const userIds = users.map(user => user.userId);
            // console.log(userIds);
            const activityModel = await UserActivityModel.deleteMany({"userId": {$in: userIds}}).exec();
            const testModel = await TestModel.deleteMany({"userId": {$in: userIds}}).exec();
            console.log(activityModel, testModel);
        } catch (error) {
            console.log(error)
        }
    }
}