import {Schema, mongoose} from '../../lib/mongoose.lib';

let ChapterSchema = new Schema({
    stream: {type: String},
    class: {type: String},
    subject: {type: String},
    chapter: {type: String},
});

let SubChapterSchema = new Schema({
    stream: {type: String},
    class: {type: String},
    subject: {type: String},
    chapter: {type: String},
},{ _id : false });


const ChapterModel = mongoose.model('Chapter', ChapterSchema);

export { ChapterModel, SubChapterSchema };