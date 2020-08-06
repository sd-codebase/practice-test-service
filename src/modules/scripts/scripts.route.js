import express from '../../lib/express.lib';
import * as Scripts from './scripts.controller';

const ScriptRoutes = express.Router();

ScriptRoutes.put('/update-no-of-answers', Scripts.updateNoOfAnswers);
ScriptRoutes.put('/update-course', Scripts.updateCourses);

export { ScriptRoutes };