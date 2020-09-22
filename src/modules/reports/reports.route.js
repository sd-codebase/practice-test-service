import express from '../../lib/express.lib';
// import * as User from './user.controller';

const ReportsRoutes = express.Router();

ReportsRoutes.get('/progress-analysis-line', (req, res) => { res.send( [
    ['12-sep', 24],
    ['13-sep', 34],
    ['14-sep', 44],
    ['15-sep', 54],
    ['16-sep', 64],
  ])}
);
ReportsRoutes.get('/progress-analysis-pie', (req, res) => { res.send([
    ['Correct', 10],
    ['Wrong', 12],
    ['Skipped', 8],
  ])}
);
ReportsRoutes.get('/progress-analysis-bar', (req, res) => { res.send([
    ['Chapter 1', 10, 12, 28],
    ['Chapter 2', 5, 13, 32],
    ['Chapter 3', 9, 16, 25],
    ['Chapter 4', 5, 18, 27],
    ['Chapter 5', 11, 9, 30]
  ])}
);

export { ReportsRoutes };