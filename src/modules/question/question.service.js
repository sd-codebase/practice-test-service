import { QuestionModel as Question, InfoParaModel as Para} from './question.model';

export class QuestionService {
    static async getQuestionById(questionId) {
        try {
            const question = await Question.findById(questionId).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    } 

    static async getQuestions(query) {
        try {
            let questions = await Question.find(query).sort({ 'sortOrder' : 1}).exec();
            questions = questions.map( question => question.toJSON());
            questions.forEach(question => {question.id=question._id});
            return {status: 1, data: questions};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async verifyQuestion(questionId) {
        try {
            const updated = await Question.updateOne({'_id': questionId}, {'isVerified': true}).exec();
            return {status: 1, data: updated};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async updateAndVerifyQuestion(question) {
        try {
            const updated = await Question.updateOne({'_id': question._id}, {
                isVerified: true,
                question: question.question,
                options: question.options,
                answer : question.answer,
                answerDescription : question.answerDescription,
            }).exec();
            return {status: 1, data: updated};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getQuestion(query) {
        try {
            const question = await Question.findOne(query).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getQuestionsByIdIn(questionIds) {
        try {
            const question = await Question.find({'_id': {$in: questionIds}}).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getQuestionsBySectionCriteria(sections, course) {
        try {
            const sectionList = [];
            sections.forEach( section => {
                const sec = {...section};
                sec.blocks.forEach( block => {
                    const childSec = {...sec, ...block};
                    sectionList.push(childSec);
                });
            });
            let questionList = [];
            for (const section of sectionList) {
                const sizeOfSample = section.questionNumberTo - section.questionNumberFrom + 1;
                const filter = {
                    "chapter.course": { $elemMatch: {$eq: course} },
                    "chapter.subject": section.subject,
                    "answer": { '$ne': 'bonus' },
                };
                if (!section.chapters.includes('All')) {
                    filter["chapter.chapter"] = {$in: section.chapters};
                }
                if (!section.topics.includes('All')) {
                    filter["chapter.topic"] = {$in: section.topics};
                }
                if (section.type === 0) {
                    filter.question = { $regex: /inputbox/, $options: 'i' };
                } else if(section.type !== 0) {
                    filter.noOfAnswers = section.type;
                }
                const questions = await Question.aggregate([{ $match: filter}, {$sample: {size: sizeOfSample}}]).exec();
                questionList = [...questionList, ...questions];
            }
            return {
                status: 1,
                data: questionList
            };
        } catch (err) {
            return {status: 0, err};
        }
    }

    static async getRandomQuestions(limit,subject) {
        try {
            let query = {};
            if(subject) {
                query = {'chapter.subject': subject};
            }
            const question = await Question.find(query).limit(limit).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async createQuestion(question, userToVerify) {
        try {
            const criteria = {
                'question': question.question,
                'options.0': question.options[0],
                'options.1': question.options[1],
                'options.2': question.options[2],
                'options.3': question.options[3],
                'chapter.subject': question.chapter.subject,
            };
            let {data: savedQuestion} = await QuestionService.getQuestion(criteria);
            if (!savedQuestion) {
                question.noOfAnswers = question.answer.split(',').length,
                question = new Question(
                    question
                );
                question.verifiedBy = userToVerify;
                question.isVerified = false;
                question = await question.save();
            } else {
                let tags = savedQuestion.tags;
                if (tags && tags.indexOf(question.tags) === -1) {
                     tags = tags + ', ' + question.tags
                } else {
                    tags = question.tags;
                }
                question = await Question.findOneAndUpdate(criteria, {
                    level : question.level,
                    answer : question.answer,
                    answerDescription : question.answerDescription,
                    isSingleAnswer : question.isSingleAnswer,
                    imagePath : question.imagePath,
                    noOfAnswers: question.answer.split(',').length,
                    tags: tags,
                }, {new: true});
            }
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async uploadQuestions({questions, userId}){
        const uploadResult = [];
        for(let i=0; i<questions.length; i++) {
            uploadResult.push(await QuestionService.createQuestion(questions[i], userId));
        }
        return uploadResult;
    }

    static async getAnswer(questionId) {
        try {
            let {data: question} = await QuestionService.getQuestionById(questionId);
            let que = question.toJSON();
            return {status: 1, data: {answer: que.answer, answerDescription: que.answerDescription}};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async createInformationPara(para) {
        try {
            let infoParas = await Para.find({}).sort({paraId : -1}).limit(1).exec();
            if(infoParas && infoParas.length) {
                para.paraId = infoParas[0].paraId + 1;
            } else {
                para.paraId = 1;
            }
            para = new Para(para);
            const data = await para.save();
            return {status: 1, data};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async updateInformationPara(para) {
        try {
            const updated = await Para.updateOne({'_id': para._id}, {
                content: para.content,
                tags: para.tags,
                updatedBy: para.updatedBy
            }).exec();
            return {status: 1, data: updated};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getParaInfos() {
        try {
            const paras = await Para.find({}).exec();
            return {status: 1, data: paras};
        } catch(err){
            return {status: 0, err};
        }
    }
}

class QuestionToUpdate{
    constructor({level, answer, answerDescription, isSingleAnswer, imagePath}) {
        this.level = level;
        this.answer = answer;
        this.answerDescription = answerDescription;
        this.isSingleAnswer = isSingleAnswer;
        this.imagePath = imagePath;
    }
}