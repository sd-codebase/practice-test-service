import { UserModel as User, GuestUserModel as GuestUser, GuestUserGroupModel as Group} from './user.model';
import { generateJWTToken } from './../../utils/auth';

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

    static async saveUser(user) {
        try {
            let savedUser = await User.findOne({'email': user.email}).exec();
            if (savedUser) {
                user._id = savedUser._id;
                await User.updateOne({'_id': savedUser._id}, user).exec();
            } else {
                user = new User(user);
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

    static async authenticateUser(user) {
        try {
            let savedUser = await User.findOne({'email': user.email, 'password': user.password}).exec();
            if (savedUser) {
                return {
                    status: 1,
                    data: { savedUser, token: generateJWTToken({_id: savedUser._id, email: savedUser.email, password: savedUser.password, userType: 'User'})}
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
                return {
                    status: 1,
                    data: { savedUser, token: generateJWTToken({_id: savedUser._id, email: savedUser.email, userType: 'Guest'})}
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
}