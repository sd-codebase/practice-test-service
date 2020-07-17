import { NotesService } from './notes.service';

async function getNotes (req, res, next) {
    const {status, data, err} = await NotesService.getNotes(req.query);
    if(status === 0) return next(err);
    res.send(data);
};

async function uploadNotes (req, res, next) {
    const uploadResult = await NotesService.createNotes(req.body);
    res.send(uploadResult);
};

export { getNotes, uploadNotes };