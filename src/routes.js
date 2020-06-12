import { DashboardRoutes } from './modules/dashboard/dashboard.route';
import { QuestionRoutes } from './modules/question/question.route';
import { TestRoutes } from './modules/test/test.route';

function enableRoutes(app) {
    app.use('/', function(req, res, next){res.end('Apis are working')});
    app.use('/api/dashboard', DashboardRoutes);
    app.use('/api/tests', TestRoutes);
    app.use('/api/questions', QuestionRoutes);
}

export { enableRoutes };