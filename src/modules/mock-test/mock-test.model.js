import {Schema, mongoose} from '../../lib/mongoose.lib';

let MockTestSchema = new Schema({
    paperName: {type: String, unique:true},
    course: {type: String},
    type: {type: Number, default: 0},
    noOfQuestions: {type: Number},
    isNegativeMarking: {type: Boolean, default: true},
    isSectionwisePassing: {type: Boolean, default: false},
    passingPercentage: {type: Number},
    sections: {type: [MockTestSectionSchema]},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

let MockTestSectionSchema = new Schema({
    sectionName: {type: String},
    marksToEachQuestion: {type: Number, default: 4},
    minutesToEachQuestion: {type: Number, default: 2},
    isOptionwiseNegativeMarking: {type: Boolean, default: false},
    negativeMarksToEachQuestion: {type:Number, default: 1},
    passingPercentage: {type: Number},
    subject: {type: String},
    instructions: {type: String},
    blocks:{type: [MockTestSectionBlockSchema]}
},{_id : false});

let MockTestSectionBlockSchema = new Schema({
    questionNumberFrom: {type: Number},
    questionNumberTo: {type: Number},
    type: {type: Number}, //0-integer-input, 1-one option, 2-two, 3-three, 4-four
    chapters: {type: [String]},
    topics: {type: [String]},
},{_id : false});

const MockTestModel = mongoose.model('MockTest', MockTestSchema);
const MockTestSectionModel = mongoose.model('MockTestSection', MockTestSectionSchema);
const MockTestSectionBlockModel = mongoose.model('MockTestSectionBlock', MockTestSectionBlockSchema);
export { MockTestModel, MockTestSectionModel, MockTestSectionBlockModel };
