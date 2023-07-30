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
            log.logger.debug(`[UserRepository] Error deleting inactive users: ${error}`);
            throw new Error("Error deleting inactive users");
        }
    };

}