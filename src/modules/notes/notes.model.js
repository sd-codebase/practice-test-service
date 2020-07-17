import {Schema, mongoose} from '../../lib/mongoose.lib';

let NotesSchema = new Schema({
    stream: {type: String},
    class: {type: String},
    subject: {type: String},
    chapter: {type: String},
    topic: {type: String},
    data: {type: String}
});

const NotesModel = mongoose.model('Notes', NotesSchema);

export { NotesModel };