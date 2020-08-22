import {Schema, mongoose} from '../../lib/mongoose.lib';

let ApiEndPointsSchema = new Schema({
    course: {type: String},
    url: {type: String},
    header: {type: String},
    color: {type: String},
    content: {type: String},
});

export const ApiEndpointsModel = mongoose.model('ApiEndpoint', ApiEndPointsSchema);
