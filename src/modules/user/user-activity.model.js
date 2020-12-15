import {Schema, mongoose} from '../../lib/mongoose.lib';

let UserActivitySchema = new Schema({
    userId: {type: String},
    updatedAt: {type: Date, default: Date.now()}
});

const UserActivityModel = mongoose.model('UserActivity', UserActivitySchema);

export { UserActivityModel }