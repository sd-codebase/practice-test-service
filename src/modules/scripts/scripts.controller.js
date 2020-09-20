const { ScriptService } = require('./scripts.services');

export async function updateNoOfAnswers (req, res, next) {
    ScriptService.updateNoOfAnswers()
    res.send({status: 1, message: 'Job started'});
};

export async function updateCourses (req, res, next) {
    ScriptService.updateCourses()
    res.send({status: 1, message: 'Job started'});
};

export async function updateChapters (req, res, next) {
    ScriptService.updateChapters()
    res.send({status: 1, message: 'Job started'});
};