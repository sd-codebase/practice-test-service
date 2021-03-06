import { UserModel as User, GuestUserModel as GuestUser, GuestUserGroupModel as Group, AppVersionModel as AppVersion} from './user.model';
import { ApiEndpointsModel } from '../api-endpoints/api-endpoint.model';
import { generateJWTToken, verifyJWTToken } from './../../utils/auth';
import { sendMail } from './../../utils/email-sending.util';
const md5 = require('md5');

export class UserService {
    static async getUser(userId) {
        try {
            let user = await User.findOne({'_id': userId}).exec();
            return {
                status: 1,
                data: user
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }
    
    static async getGuestUserByDetails(user) {
        try {
            const userDetails = await GuestUser.findOne(user).exec();
            if(userDetails) {
                return {
                    status: 1,
                    data: userDetails
                };
            } else {
                return {
                    status: 0,
                    err: 'No user exists'
                };
            }
            
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async verifyToken(query) {
        const user = verifyJWTToken(query.sessionID);
        if (user) {
            if(user.userType === 'Guest') {
                return await UserService.getGuestUserByDetails({_id: user._id, email:user.email});
            } else if(user.userType === 'UserWithDeviceId') {
                return await UserService.getUserByDetails({_id: user._id, deviceId:user.deviceId});
            } else {
                return await UserService.getUserByDetails({_id: user._id, email:user.email});
            }
        } else {
            return {
                status: 0,
                err: {message: 'Token is not valid'}
            };
        }
    }

    static async getUserByDetails(user) {
        try {
            const userDetails = await User.findOne(user).exec();
            if(userDetails) {
                return {
                    status: 1,
                    data: userDetails
                };
            } else {
                return {
                    status: 0,
                    err: 'No user exists'
                };
            }
            
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async saveUserWithDeviceId(user) {
        try {
            let savedUser = await User.findOne({'deviceId': user.deviceId}).exec();
            if (!savedUser) {
                user = new User({deviceId: user.deviceId, courses: [user.course]});
                await user.save();
                savedUser = await User.findOne({'deviceId': user.deviceId}).exec();
            } else {
                savedUser = savedUser.toJSON();
                if(!savedUser.courses.includes(user.course)) {
                    savedUser.courses.push(user.course);
                    await User.updateOne({'_id': savedUser._id}, {courses: savedUser.courses, updatedAt: Date.now()}).exec();
                }
            }
            let criteria = {'course': {$in: savedUser.courses}};
            let endpoints = await ApiEndpointsModel.find(criteria).exec();
            savedUser.courses.sort();
            return {
                status: 1,
                data: {
                    savedUser, 
                    token: generateJWTToken({_id: savedUser._id, deviceId: savedUser.deviceId, userType: 'UserWithDeviceId'}),
                    endpoints
                }
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async saveUser(user) {
        try {
            let savedUser = await User.findOne({'email': user.email}).exec();
            if (savedUser) {
                user._id = savedUser._id;
                await User.updateOne({'_id': savedUser._id}, user).exec();
            } else {
                user.password = md5(user.password);
                user.otp = "" + Math.floor(1000 + Math.random() * 9000);
                user = new User(user);
                user.save();
                sendMail('Account Verification', user.email, user.otp, 'Account verification');
            }
            return {
                status: 1,
                data: user
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async resendOtpForVerification({email}) {
        try {
            let savedUser = await User.findOne({'email': email}).exec();
            if (savedUser) {
                savedUser = savedUser.toJSON();
                savedUser.otp = "" + Math.floor(1000 + Math.random() * 9000);
                await User.updateOne({'_id': savedUser._id}, {otp: savedUser.otp}).exec();
                sendMail('Forgot Password', savedUser.email, savedUser.otp, 'Forgot password');
            } else {
                throw {message: "No user found, plaese contact to administrator"}
            }
            return {
                status: 1,
                data: savedUser
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async verifyAccount({email, otp}) {
        try {
            let savedUser = await User.findOne({'email': email, 'otp': otp}).exec();
            if (savedUser) {
                savedUser = await User.updateOne({'_id': savedUser._id}, {email_verified: true, otp: ''}).exec();
            } else {
                throw {message: "Probably Otp incorrect"};
            }
            return {
                status: 1,
                data: savedUser
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async forgotPassword({email}) {
        try {
            let savedUser = await User.findOne({'email': email}).exec();
            if (savedUser) {
                savedUser = savedUser.toJSON();
                savedUser.otp = "" + Math.floor(1000 + Math.random() * 9000);
                await User.updateOne({'_id': savedUser._id}, {otp: savedUser.otp}).exec();
                sendMail('Forgot Password', email, savedUser.otp, 'Forgot password');
            } else {
                throw {message: "No user found"}
            }
            return {
                status: 1,
                data: savedUser
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async resetPassword({email, otp, password}) {
        try {
            let savedUser = await User.findOne({'email': email, 'otp': otp}).exec();
            if (savedUser) {
                savedUser = await User.updateOne({'_id': savedUser._id}, {password: md5(password), otp: ''}).exec();
            } else {
                throw {message: "Probably Otp incorrect"};
            }
            return {
                status: 1,
                data: savedUser
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async changePassword({email, oldPassword, password}) {
        try {
            let savedUser = await User.findOne({'email': email, password: md5(oldPassword)}).exec();
            if (savedUser) {
                savedUser = await User.updateOne({'_id': savedUser._id}, {password: md5(password)}).exec();
            } else {
                throw {message: "User not found"};
            }
            return {
                status: 1,
                data: savedUser
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async authenticateUser(user) {
        try {
            let savedUser = await User.findOne({'email': user.email, 'password': md5(user.password)}).exec();
            if (savedUser) {
                savedUser = savedUser.toJSON();
                let criteria = {'course': {$in: savedUser.courses}};
                if(savedUser.role === 3) { //isAdmin
                    criteria = {};
                }
                let endpoints = await ApiEndpointsModel.find(criteria).exec();
                if(savedUser.role === 3) { //isAdmin
                    savedUser.courses = endpoints.map(endPoint => endPoint.course);
                }
                savedUser.courses.sort();
                return {
                        status: 1,
                    data: {
                        savedUser, 
                        token: generateJWTToken({_id: savedUser._id, email: savedUser.email, password: savedUser.password, userType: 'User'}),
                        endpoints
                    }
                };
            } else {
                return {
                    status: 0,
                    err: {message: "No user exists"}
                };
            }
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async authenticateGuestUser(user) {
        try {
            let savedUser = await GuestUser.findOne({'email': user.email}).exec();
            if (savedUser) {
                let endpoints = await ApiEndpointsModel.find({}).exec();
                return {
                    status: 1,
                    data: { 
                        savedUser,
                        token: generateJWTToken({_id: savedUser._id, email: savedUser.email, userType: 'Guest'}),
                        endpoints
                    }
                };
            } else {
                return {
                    status: 0,
                    err: {message: "No user exists"}
                };
            }
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async createUserBelongsToInstructor(user) {
        try {
            let savedUser = await GuestUser.findOne({'email': user.email}).exec();
            user = new GuestUser(user);
            if (savedUser) {
                return {
                    status: 0,
                    err : {message: 'Guest user already exists.'}
                };
            } else {
                user.save();
            }
            return {
                status: 1,
                data: user
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }
    
    static async fetchUsersByInstructor(instructorId) {
        try {
            const users = await GuestUser.find({belongsTo: instructorId}).sort({ updatedAt : -1}).exec();
            if(users) {
                return {
                    status: 1,
                    data: users
                };
            } else {
                return {
                    status: 0,
                    err: 'No users exist'
                };
            }
            
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async createGuestUserGroup(group) {
        try {
            let savedGroup = await Group.findOne({'name': group.name, belongsTo: group.belongsTo}).exec();
            group = new Group(group);
            if (savedGroup) {
                return {
                    status: 0,
                    err : {message: 'Guest user group already exists.'}
                };
            } else {
                group.save();
            }
            return {
                status: 1,
                data: group
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async updateUsersToGroup(group) {
        try {
            let savedGroup = await Group.findOne({'name': group.name, 'belongsTo': group.belongsTo}).exec();
            if (savedGroup) {
                await Group.findOneAndUpdate({'name': group.name, 'belongsTo': group.belongsTo}, {users:group.users}, {new: true});
                return {
                    status: 1,
                    data: { message: 'Group updated'}
                };
            } else {
                return {
                    status: 0,
                    err: {message: 'No group exists'}
                };
            }
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async getUsersGroup(belongsTo) {
        try {
            let savedGroup = await Group.find({'belongsTo': belongsTo}).exec();
            return {
                status: 1,
                data: savedGroup
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async getCourses() {
        try {
            let courses = await ApiEndpointsModel.find({}).exec();
            return {
                status: 1,
                data: courses
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }

    static async getAppVersion() {
        try {
            let version = await AppVersion.findOne({}).sort({version:-1}).exec();
            return {
                status: 1,
                data: version
            };
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }
}