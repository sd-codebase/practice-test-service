import { UserModel as User} from './user.model';

export class UserService {
    static async getUser(userId) {
        try {
            let user = await User.findOne({'userId': userId}).exec();
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

    static async saveUser(user) {
        try {
            let savedUser = await User.findOne({'userId': user.userId}).exec();
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
}