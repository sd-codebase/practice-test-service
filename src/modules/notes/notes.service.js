import { NotesModel as Notes } from './notes.model';

export class NotesService {
    static async getNotes(criteria) {
        try {
            let notes = await Notes.findOne(criteria).exec();
            return {
                status: 1,
                data: notes
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async createNotes(notes) {
        try {
            const criteria = {
                'stream': notes.stream,
                'class': notes.class,
                'subject': notes.subject,
                'chapter': notes.chapter,
                'topic': notes.topic,
            };
            let {data: note} = await NotesService.getNotes(criteria);
            if(note) {
                notes = await Notes.findOneAndUpdate(criteria, { data: notes.data}, {
                    new: true
                });
            } else {
                notes = new Notes(
                    notes
                );
                notes = await notes.save();
            }
            return {status: 1, data: notes};
        } catch(err){
            return {status: 0, err};
        }
    }
}