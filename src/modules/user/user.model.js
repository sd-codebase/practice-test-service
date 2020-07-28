import {Schema, mongoose} from '../../lib/mongoose.lib';

let UserSchema = new Schema({
    email: {type: String, unique:true},
    password: {type: String},
    name: {type: String},
    email_verified: {type: Boolean, default: false},
    course: {type: String},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});


const UserModel = mongoose.model('User', UserSchema);

export {UserModel};