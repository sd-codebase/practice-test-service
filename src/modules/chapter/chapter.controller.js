import { ChapterService } from './chapter.service';

async function getChapters (req, res, next) {
    const {status, data, err} = await ChapterService.getChapters();
    if(status === 0) return next(err);
    res.send(data);
};

async function uploadChapters (req, res, next) {
    const uploadResult = await ChapterService.uploadChapters(req.body);
    res.send(uploadResult);
};

export { getChapters, uploadChapters };
