import express from '../../lib/express.lib';
import * as Chapter from './chapter.controller';

const ChapterRoutes = express.Router();


ChapterRoutes.get('/', Chapter.getChapters);
ChapterRoutes.post('/import', Chapter.uploadChapters);

export { ChapterRoutes };
