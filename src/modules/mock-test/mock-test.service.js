import { 
    MockTestModel as MockTest,
    MockTestSectionModel as MockTestSection,
    MockTestSectionBlockModel as MockTestSectionBlock,
} from './mock-test.model';

export class MockTestService {
    static async getMockTestById(testId) {
        try {
            const mockTest = await MockTest.findById(testId).exec();
            return {status: 1, data: mockTest};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getMockTestByQuery(query) {
        try {
            const mockTest = await MockTest.findOne(query).exec();
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

    static async createMockTest(testConfig) {
        try {
            const sections = testConfig.sections;
            delete testConfig.sections;
            const mocktestConfig = new MockTest(testConfig);
            const mockTest = await mocktestConfig.save();
            testConfig.sections = sections;
            await MockTest.updateOne({'_id': mockTest._id}, {$set: testConfig}).exec();
            const savedMockTest = await MockTestService.getMockTestById(mockTest._id);
            return {status: 1, data: savedMockTest.data};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async updateMockTest(testId, mocktest) {
        try {
            mocktest.updatedAt = Date.now();
            const mockTestUpdated = await MockTest.updateOne({'_id': testId}, {$set: mocktest}).exec();
            return {status: 1, data: mockTestUpdated};
        } catch(err){
            return {status: 0, err};
        }
    }
}