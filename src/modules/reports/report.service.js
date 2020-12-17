import { TestModel as Test} from './../test/test.model';
var moment = require('moment');

export class ReportService {
    static async getLineChartReport(query) {
        if(query.chartType === 'dates') {
            return await ReportService.getLineChartByDates(query);
        } else {
            return await ReportService.getLineChartByTests(query);
        }
    }

    static async getLineChartByTests({userId}) {
        try {
            let startDate = new Date();
            startDate = addMonths(startDate, -6);
            const tests = await Test.find({userId, status: 2, updatedAt:{"$gte": startDate}}, {testName: 1, percentage: 1, updatedAt: 1 ,_id: 0}).exec();
            const res = tests.map(test => [test.testName, test.percentage]);
            return {status: 1, data: res};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getLineChartByDates({userId}) {
        try {
            let startDate = new Date();
            startDate = addMonths(startDate, -6);
            const tests = await Test.find({userId, status: 2, updatedAt:{"$gte": startDate}}, {testName: 1, percentage: 1, updatedAt: 1 ,_id: 0}).exec();
            let res = tests.map(test => { 
                return {
                    testName: test.testName,
                    percentage: test.percentage,
                    dt: moment(test.updatedAt, 'YYYY-MM-DD').format('MMM DD'),
                }
            });
            const groups = {};
            res.forEach( test => {
                if(!groups[test.dt]) {
                    groups[test.dt] = [test.percentage, 1];
                } else {
                    groups[test.dt][0] = groups[test.dt][0] + test.percentage;
                    groups[test.dt][1] = groups[test.dt][1] + 1;

                }
            });
            res = Object.keys(groups).map( key => [key, groups[key][0] / groups[key][1]]);
            return {status: 1, data: res};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getPieChartReport({userId}) {
        try {
            let startDate = new Date();
            startDate = addMonths(startDate, -6);
            const tests = await Test.find({userId, status: 2, updatedAt:{"$gte": startDate}}, {correctCount: 1, attemptCount: 1, questionCount:1, _id: 0}).exec();
            const res = [
                ['Correct', 0],
                ['Wrong', 0],
                ['Skipped', 0],
            ];
            tests.forEach( test => {
                res[0][1] = res[0][1] + test.correctCount;
                let wrong = test.attemptCount - test.correctCount;
                let skipped = test.questionCount - test.attemptCount;
                res[1][1] = res[1][1] + wrong;
                res[2][1] = res[2][1] + skipped;

            });
            return {status: 1, data: res};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getBarChartReport({chartSubject, userId}) {
        try {
            let startDate = new Date();
            startDate = addMonths(startDate, -2);
            const tests = await Test.find({userId, status: 2, updatedAt:{"$gte": startDate}}, {questions: 1, _id: 0}).exec();
            let res = [];
            tests.forEach( test => {
                let list = test.questions.filter(que => que.chapter.subject === chartSubject);
                list = list.map( que => { return {
                    chapter: que.chapter.chapter,
                    correct: que.isSubmitted === true && que.isCorrectAnswer ? 1 : 0,
                    skipped: !que.isSubmitted ? 1 : 0,
                    wrong: que.isSubmitted === true && !que.isCorrectAnswer ? 1 : 0 };
                });
                res = [...res, ...list];
            });
            const groups = {};
            res.forEach( queInfo => {
                if (groups[queInfo.chapter]) {
                    const ob = groups[queInfo.chapter];
                    const arr = [ob[0] + queInfo.skipped, ob[1] + queInfo.wrong, ob[2] + queInfo.correct ]
                    groups[queInfo.chapter] = arr;
                } else {
                    groups[queInfo.chapter] = [0, 0, 0];
                }
            });

            res = Object.keys(groups).map( key => [key, groups[key][0], groups[key][1], groups[key][2]]);
            
            return {status: 1, data: res};
        } catch(err){
            return {status: 0, err};
        }
    }
}

function addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
}