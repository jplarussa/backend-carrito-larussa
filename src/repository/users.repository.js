export default class UserRepository{

    constructor(dao){
        this.dao = dao;
    }

    async createUser(user) {

        return await this.dao.createUser(user);
    };

    async getAll() {

        return await this.dao.getAll();
    };

    async findOne(email) {

        return await this.dao.findOne(email);
    };

    async updateUser(userId, userToReplace) {

        return await this.dao.updateUser(userId, userToReplace);
    }

    async findById(id) {

        return await this.dao.findById(id);
    };

    async deleteInactiveUsers(days) {
        try {
            const users = await this.dao.deleteInactiveUsers(days);
            return users;

        } catch (error) {
            throw new Error("Error deleting inactive users");
        }
    };
    async deleteUser(uid) {
        try {
            const users = await this.dao.deleteUser(uid);
            console.log("//////REPO//////");
            console.log("UID");
            console.log(uid);
            console.log("users");
            console.log(users);
            return users;

        } catch (error) {
            throw new Error(`Error deleting the user ${uid} users`);
        }
    };

uid}