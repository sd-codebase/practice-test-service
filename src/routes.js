import { DashboardRoutes } from './modules/dashboard/dashboard.route';
import { QuestionRoutes } from './modules/question/question.route';
import { TestRoutes } from './modules/test/test.route';
import { ChapterRoutes } from './modules/chapter/chapter.route';
import { UserRoutes } from './modules/user/user.route';
import { NotesRoutes } from './modules/notes/notes.route';
import { MockTestRoutes } from './modules/mock-test/mock-test.route';
import { ScriptRoutes } from './modules/scripts/scripts.route';
import { API, ROUTES } from './utils/auth-routes';
import { ReportsRoutes } from './modules/reports/reports.route';


function enableRoutes(app) {
    // app.use('/', function(req, res, next){
    //     res.end('Assessment portal services are in maintenance mode.')
    // });
    app.use(`/${API}/${ROUTES.Dashboard}`, DashboardRoutes);
    app.use(`/${API}/${ROUTES.Test}`, TestRoutes);
    app.use(`/${API}/${ROUTES.Question}`, QuestionRoutes);
    app.use(`/${API}/${ROUTES.User}`, UserRoutes);
    app.use(`/${API}/${ROUTES.Chapter}`, ChapterRoutes);
    app.use(`/${API}/${ROUTES.Note}`, NotesRoutes);
    app.use(`/${API}/${ROUTES.MockTest}`, MockTestRoutes);
    app.use(`/${API}/${ROUTES.Scripts}`, ScriptRoutes);
    app.use(`/${API}/${ROUTES.Reports}`, ReportsRoutes);
    app.use('/', function(req, res, next){
        res.end('Assessment portal services are running')
    });
}

export { enableRoutes };