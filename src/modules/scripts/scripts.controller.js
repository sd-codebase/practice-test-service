const { ScriptService } = require('./scripts.services');

export async function updateNoOfAnswers (req, res, next) {
    res.send(await ScriptService.updateNoOfAnswers());
};

export async function updateCourses (req, res, next) {
    res.send(await ScriptService.updateCourses());
};