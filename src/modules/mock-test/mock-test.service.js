import { MockTestModel as MockTest, MockTestSectionModel as MockTestSection } from './mock-test.model';

export class MockTestService {
    static async getMockTestById(testId) {
        try {
            const mockTest = await MockTest.findById(testId).exec();
            return {status: 1, data: mockTest};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getMockTestByCourse(course) {
        try {
            let criteria = {};
            if( course !== 'All' ) {
                criteria = {'course' : course};
            }
            const mockTests = await MockTest.find(criteria).exec();
            return {status: 1, data: mockTests};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getMockTests() {
        try {
            const mockTests = await MockTest.find({}).exec();
            return {status: 1, data: mockTests};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async createMockTest(mocktest) {
        try {
            const sections = new Array();
            mocktest.sections.forEach( section => sections.push(new MockTestSection(section)));
            delete mocktest.sections;
            mocktest = new MockTest(mocktest);
            const mockTest = await mocktest.save();
            await MockTest.updateOne({'_id': mockTest._id}, {$set: {sections: sections}}).exec();
            const savedMockTest = await MockTestService.getMockTestById(mockTest._id);
            return {status: 1, data: savedMockTest.data};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async updateMockTest(testId, mocktest) {
        try {
            const mockTestUpdated = await MockTest.updateOne({'_id': testId}, {$set: mocktest}).exec();
            return {status: 1, data: mockTestUpdated};
        } catch(err){
            return {status: 0, err};
        }
    }
}