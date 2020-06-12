import {Schema, mongoose} from '../../lib/mongoose.lib';

let CountSchema = new Schema({
    name: {type: String, required: true},
    count: {type: Number, required: true}
});

const CountModel = mongoose.model('Count', CountSchema);

export { CountModel };