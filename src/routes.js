import { DashboardRoutes } from './modules/dashboard/dashboard.route';
import { QuestionRoutes } from './modules/question/question.route';
import { TestRoutes } from './modules/test/test.route';
import { ChapterRoutes } from './modules/chapter/chapter.route';
import { UserRoutes } from './modules/user/user.route';
import { NotesRoutes } from './modules/notes/notes.route';

function enableRoutes(app) {
    app.use('/api/dashboard', DashboardRoutes);
    app.use('/api/tests', TestRoutes);
    app.use('/api/questions', QuestionRoutes);
    app.use('/api/users', UserRoutes);
    app.use('/api/chapters', ChapterRoutes);
    app.use('/api/notes', NotesRoutes);
    app.use('/', function(req, res, next){res.end('Apis are working')});
}

export { enableRoutes };