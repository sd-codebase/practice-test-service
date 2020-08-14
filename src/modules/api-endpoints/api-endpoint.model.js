import {Schema, mongoose} from '../../lib/mongoose.lib';

let ApiEndPointsSchema = new Schema({
    course: {type: String},
    url: {type: String},
});

export const ApiEndpointsModel = mongoose.model('ApiEndpoint', ApiEndPointsSchema);
