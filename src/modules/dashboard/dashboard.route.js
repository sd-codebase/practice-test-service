import express from '../../lib/express.lib';
import * as Dashboard from './dashboard.controller';

const DashboardRoutes = express.Router();

DashboardRoutes.get('/counts', Dashboard.getCounts);

export { DashboardRoutes };