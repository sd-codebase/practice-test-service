import {Schema, mongoose} from '../../lib/mongoose.lib';

let UserSchema = new Schema({
    email: {type: String},
    password: {type: String},
    name: {type: String},
    contact: {type: String},
    email_verified: {type: Boolean, default: false},
    role: {type: Number, default: 2},
    courses: {type: [String], default: []},
    otp: {type: String},
    emailRecoveryKey: {type: String},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
    deviceId: {type: String},
});

let GuestUserSchema = new Schema({
    email: {type: String, unique:true},
    name: {type: String},
    contact: {type: String},
    belongsTo: {type: String},
    courses: {type: [String]},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

let GuestUserGroupSchema = new Schema({
    name: {type: String},
    belongsTo: {type: String},
    users: {type: [String]},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

let AppVersionSchema = new Schema({
    version: {type: String},
    isMajorUpdate: {type: Boolean},
    updateInfo: {type: String},
    updateDate: {type: String},
    createdAt: {type: Date, default: Date.now()},
});

const UserModel = mongoose.model('User', UserSchema);
const GuestUserModel = mongoose.model('GuestUser', GuestUserSchema);
const GuestUserGroupModel = mongoose.model('GuestUserGroup', GuestUserGroupSchema);
const AppVersionModel = mongoose.model('AppVersion', AppVersionSchema);

export {UserModel, GuestUserModel, GuestUserGroupModel, AppVersionModel};