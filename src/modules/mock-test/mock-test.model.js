import {Schema, mongoose} from '../../lib/mongoose.lib';

let MockTestSchema = new Schema({
    paperName: {type: String, unique:true},
    course: {type: String},
    noOfQuestions: {type: Number},
    marksToEachQuestion: {type: Number, default: 4},
    negativeMarksToEachQuestion: {type:Number, default: 1},
    isNegativeMarking: {type: Boolean, default: true},
    isOptionwiseNegativeMarking: {type: Boolean, default: false},
    passingPercentage: {type: Number},
    sections: {type: [MockTestSectionSchema]},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

let MockTestSectionSchema = new Schema({
    sectionName: {type: String},
    questionNumberFrom: {type: Number},
    questionNumberTo: {type: Number},
    type: {type: Number}, //0-integer-input, 1-one option, 2-two, 3-three, 4-four
    subject: {type: String},
    chapters: {type: [String]},
    topics: {type: [String]},
    instructions: {type: String},
},{_id : false});

const MockTestModel = mongoose.model('MockTest', MockTestSchema);
const MockTestSectionModel = mongoose.model('MockTestSection', MockTestSectionSchema);
export { MockTestModel, MockTestSectionModel };
