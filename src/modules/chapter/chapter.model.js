import {Schema, mongoose} from '../../lib/mongoose.lib';

let ChapterSchema = new Schema({
    stream: {type: String},
    class: {type: String},
    subject: {type: String},
    chapter: {type: String},
});


const ChapterModel = mongoose.model('Chapter', ChapterSchema);

export { ChapterModel, ChapterSchema };