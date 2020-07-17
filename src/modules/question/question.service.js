import { QuestionModel as Question} from './question.model';

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
            let questions = await Question.find(query).exec();
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
                    tags: tags,
                }, {new: true});
            }
            return {status: 1, data: question};
        } catch(err){
            console.log(err)
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