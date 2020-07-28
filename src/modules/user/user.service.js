import { UserModel as User} from './user.model';
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
            user = new User(user);
            if (savedUser) {
                user._id = savedUser._id;
                await User.updateOne({'_id': savedUser._id}, user).exec();
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

    static async authenticateUser(user) {
        try {
            let savedUser = await User.findOne({'email': user.email, 'password': user.password}).exec();
            if (savedUser) {
                return {
                    status: 1,
                    data: { savedUser, token: generateJWTToken({_id: savedUser._id, email: savedUser.email, password: savedUser.password})}
                };
            } else {
                return {
                    status: 0,
                    err
                };
            }
        } catch (err){
            return {
                status: 0,
                err
            };
        }
    }
}