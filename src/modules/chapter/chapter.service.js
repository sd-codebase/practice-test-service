import { ChapterModel as Chapter} from './chapter.model';

export class ChapterService {
    static async getChapters() {
        try {
            let chapters = await Chapter.find({}).exec();
            return {
                status: 1,
                data: chapters
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async uploadChapters({chapters, userId}){
        const uploadResult = [];
        for(let i=0; i<chapters.length; i++) {
            uploadResult.push(await ChapterService.createChapter(chapters[i], userId));
        }
        return uploadResult;
    }

    static async createChapter(chapter) {
        try {
            chapter = new Chapter(
                chapter
            );
            chapter = await chapter.save();
            return {status: 1, data: chapter};
        } catch(err){
            return {status: 0, err};
        }
    }
}