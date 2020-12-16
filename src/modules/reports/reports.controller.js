import { ReportService } from "./report.service";
const url = require('url');


export async function getLineChartReport (req, res, next) {
    const queryObject = url.parse(req.url,true).query;
    const {status, data, err} = await ReportService.getLineChartReport(queryObject);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function getPieChartReport (req, res, next) {
    const queryObject = url.parse(req.url,true).query;
    const {status, data, err} = await ReportService.getPieChartReport(queryObject);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};

export async function getBarChartReport (req, res, next) {
    const queryObject = url.parse(req.url,true).query;
    const {status, data, err} = await ReportService.getBarChartReport(queryObject);
    if(status === 0) res.status(500).send(err);
    res.send(data);
};
