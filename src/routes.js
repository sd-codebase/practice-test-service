import { DashboardRoutes } from './modules/dashboard/dashboard.route';
import { QuestionRoutes } from './modules/question/question.route';
import { TestRoutes } from './modules/test/test.route';
import { ChapterRoutes } from './modules/chapter/chapter.route';
import { UserRoutes } from './modules/user/user.route';
import { NotesRoutes } from './modules/notes/notes.route';
import { API, ROUTES } from './utils/auth-routes';
import { MONGO_URI, ENV, SECRETE_KEY } from './../config';


function enableRoutes(app) {
    app.use(`/${API}/${ROUTES.Dashboard}`, DashboardRoutes);
    app.use(`/${API}/${ROUTES.Test}`, TestRoutes);
    app.use(`/${API}/${ROUTES.Question}`, QuestionRoutes);
    app.use(`/${API}/${ROUTES.User}`, UserRoutes);
    app.use(`/${API}/${ROUTES.Chapter}`, ChapterRoutes);
    app.use(`/${API}/${ROUTES.Note}`, NotesRoutes);
    app.use('/', function(req, res, next){
        res.send('Assessment portal services are running')
    });
}

export { enableRoutes };