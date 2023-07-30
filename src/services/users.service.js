import { UserRepositoryWithDao } from "../repository/index.repository.js";
import Logger from '../config/logger.js'

const log = new Logger();

export default class UserService {

    async createUser(user) {

        const newUser = await UserRepositoryWithDao.createUser(user);
        return newUser;
    };

    async getAll() {

        const users = await UserRepositoryWithDao.getAll();
        return users
    };

    async findOne(email) {

        try {
            const result = await UserRepositoryWithDao.findOne(email);
            if (!email) {
                return res.status(401).json({ status: 'error', error: "Can't find user." });
            }

            return result;

        } catch (error) {
            next(error);
        }
    };

    async updateUser(userId, userToReplace) {

        const result = await UserRepositoryWithDao.updateUser(userId, userToReplace);
        return result;
    }

    async findById(id) {

        const result = await UserRepositoryWithDao.findById(id);
        return result;
    };

    async uploadFiles(userId, files, reference) {

        if (!userId) {
            return res.status(401).json({ status: 'error', error: "User is required." });
        }
        if (!files) {
            return res.status(401).json({ status: 'error', error: "Files are required." });
        }

        try {
            const user = await UserRepositoryWithDao.findOne(userId);

            if (!user) {
                return res.status(401).json({ status: 'error', error: "Can't find user." });
            }
            if (!user.documents) {
                user.documents = [];
            }

            files.forEach(file => {
                user.documents.push({
                    name: file.filename,
                    reference: reference,
                    status: "Uploaded"
                });
            });

            const updatedUser = await UserRepositoryWithDao.updateUser(userId, user);

            log.logger.info(`Files uploaded successfully: User ID ${userId}`);
            return updatedUser;

        } catch (error) {
            log.logger.warn(`Error uploading files: ${error.message}`);
            next(error);
        }
    };

    async swapUserRole(email) {

        if (!email) {
            return res.status(401).json({ status: 'error', error: "Email is required." });
        }

        try {

            let user = await UserRepositoryWithDao.findOne(email);
            log.logger.debug(`Get user data from: ${email}`);

            if (!user) {
                return res.status(401).json({ status: 'error', error: "Can't find user." });
            }

            if (user.role === "admin") {
                return res.status(403).json({ status: "error", message: "Admin users cant swap roles" });

            } else {

                // Check required documents por swap to Premium
                const requiredDocuments = ["Identification", "Proof of address", "Statement of Account"];

                const hasRequiredDocuments = requiredDocuments.every(document => {
                    return user.documents.some(doc => doc.reference.includes(document) && doc.status === "Uploaded");
                });

                if (hasRequiredDocuments) {

                    if (user.role === "user") {
                        user.role = "premium";
                        const changedRole = await UserRepositoryWithDao.updateUser(email, user);
                        return changedRole

                    } else if (user.role === "premium") {
                        user.role = "user";
                        const changedRole = await UserRepositoryWithDao.updateUser(email, user);
                        return changedRole
                    }

                } else {
                    throw new Error('Something went wrong validating. Must have all 3 documents to swap role');
                }
            }
        } catch (error) {
            log.logger.warn(`Error updating user role: ${error.message}`);
            next(error);
        }
    };

    async changeLastConnection(userId) {
        if (!userId) {
            throw new Error('UserId is required.');
        }
        try {
            let user = await UserRepositoryWithDao.findOne(userId);

            if (!user) {
                throw new Error('User not found.');

            } else {
                user.last_connection = new Date();
                const updatedUser = await UserRepositoryWithDao.updateUser(userId, user);

                return updatedUser;
            }
        } catch (error) {
            log.logger.warn(`Error updating user last_connection: ${error.message}`);
            next(error);
        }
    };
};
