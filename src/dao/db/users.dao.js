import { usersModel } from "./models/users.model.js";
import GetUserDTO from "../DTO/getUser.dto.js"

export default class UserDao {

    async createUser(user) {

        const newUser = await usersModel.create(user);
        return newUser;
    };

    async getAll() {

        const users = await usersModel.find();
        return users.map(user => new GetUserDTO(user.toObject()));
    };

    async findOne(email) {

        const result = await usersModel.findOne({ email }).lean();
        return result;
    };

    async updateUser(userId, userToReplace) {
        const filter = { email: userId }
        const update = { $set: userToReplace };
        const result = await usersModel.updateOne(filter, update);
        return result;
    }

    async findById(id) {

        const result = await usersModel.findById({ _id: id });
        return result;
    };

    async deleteInactiveUsers(days) {
        // First find the users that haven't logged in in the last X days.
        const inactiveUsers = await usersModel.find({ last_connection: { $lt: new Date(Date.now() - (days * 24 * 60 * 60 * 1000)) } }).lean();

        // Delete the users that haven't logged in in the last X days.
        await usersModel.deleteMany({ last_connection: { $lt: new Date(Date.now() - (days * 24 * 60 * 60 * 1000)) } });

        const inactiveUsersDTO = inactiveUsers.map(user => new GetUserDTO(user));

        return inactiveUsersDTO;
    };

    async deleteUser(uid) {
        try {
            const user = await usersModel.findOne({ email: uid }).lean();
            console.log("//////DAO//////");
            console.log("UID");
            console.log(uid);
            console.log("user");
            console.log(user);
            await usersModel.deleteOne({ email: uid });
            const userDTO = new GetUserDTO(user);
            return userDTO;

        } catch (error) {
            log.logger.console.warn(); (`Error deleting user: ${error}`);

        }

    }
}