import { userModel } from "./models/user.model.js";

export default class UserManager {

    async createUser(user) {

        const newUser = await userModel.create(user);
        return newUser;
    };

    async getAll() {

        const users = await userModel.find();
        return users.map(user => user.toObject());
    };

    async findOne(email) {

        const result = await userModel.findOne({email});
        return result;
    };

    async updateUser(userId, userToReplace) {
        const result = await userModel.updateOne({userId}, userToReplace);
        return result;
    }

    async findById(id) {

        const result = await userModel.findById({_id: id});
        return result;
    };
}