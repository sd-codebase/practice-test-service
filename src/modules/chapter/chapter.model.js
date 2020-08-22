import {Schema, mongoose} from '../../lib/mongoose.lib';

let ChapterSchema = new Schema({
    course: {type: String},
    class: {type: String},
    subject: {type: String},
    chapter: {type: String},
    topic: {type: String},
});

let SubChapterSchema = new Schema({
    courses: {type: [String]},
    class: {type: String},
    subject: {type: String},
    chapter: {type: String},
    topic: {type: String},
},{ _id : false });


const ChapterModel = mongoose.model('Chapter', ChapterSchema);

export { ChapterModel, SubChapterSchema };