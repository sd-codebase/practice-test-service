import express from '../../lib/express.lib';
import * as Notes from './notes.controller';

const NotesRoutes = express.Router();


NotesRoutes.get('/', Notes.getNotes);
NotesRoutes.post('/', Notes.uploadNotes);

export { NotesRoutes };
