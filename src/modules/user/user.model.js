import {Schema, mongoose} from '../../lib/mongoose.lib';

let UserSchema = new Schema({
    userId: {type: String, required: true},
    email: {type: String},
    email_verified: {type: Boolean},
    name: {type: String},
    nickname: {type: String},
    picture: {type: String},
    sub: {type: String},
    updated_at: {type: String},
    stream: {type: String},
    class: {type: String},
    subjects: {type: [String]},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});


const UserModel = mongoose.model('User', UserSchema);

export {UserModel};