import { UserRepositoryWithDao } from "../repository/index.repository.js";

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

            // req.logger.info(`Files uploaded successfully: User ID ${userId}`);
            return updatedUser;

        } catch (error) {
            req.logger.warn(`Error uploading files: ${error.message}`);
            next(error);
        }
    };

    async swapUserRole(email) {

        if (!email) {
            return res.status(401).json({ status: 'error', error: "Email is required." });
        }

        try {

            let user = await UserRepositoryWithDao.findOne(email);
            req.logger.debug(`Get user data from: ${email}`);

            if (!user) {
                return res.status(401).json({ status: 'error', error: "Can't find user." });
            }

            if (user.role === "admin") {
                return res.status(403).json({ status: "error", message: "Admin users cant swap roles" });

            } else {

                // check if user has uploaded all required documents
                // Documents required: Identification, Proof of address, Proof of bank account
                const requiredDocuments = ["Identification", "Proof of address", "Proof of bank account"];
                const hasRequiredDocuments = requiredDocuments.every(document => {
                    return user.documents.some(doc => doc.reference.includes(document) && doc.status === "Uploaded");
                });

                if (hasRequiredDocuments) {

                    if (user.role === "user") {
                        user.role = "premium";
                        const changedRole = await UserRepositoryWithDao.updateUser(email, user);
                        return res.status(200).json({ status: "success", message: `The Role was changed successfully to ${user.role}.` });

                    } else if (user.role === "premium") {
                        user.role = "user";
                        const changedRole = await UserRepositoryWithDao.updateUser(email, user);
                        return res.status(200).json({ status: "success", message: `The Role was changed successfully to ${user.role}.` });
                    }

                }
            }
        } catch (error) {
            req.logger.warn(`Error updating user role: ${error.message}`);
            next(error);
        }
    };

};
