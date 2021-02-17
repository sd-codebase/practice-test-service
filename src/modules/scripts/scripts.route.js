import express from '../../lib/express.lib';
import * as Scripts from './scripts.controller';

const ScriptRoutes = express.Router();

ScriptRoutes.put('/update-no-of-answers', Scripts.updateNoOfAnswers);
ScriptRoutes.put('/update-course', Scripts.updateCourses);
ScriptRoutes.put('/update-chapters', Scripts.updateChapters);
ScriptRoutes.delete('/delete-inactive-users-data', Scripts.deleteInactiveUsersData);

export { ScriptRoutes };