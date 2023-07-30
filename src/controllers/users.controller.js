import UserService from "../services/users.service.js";

const userService = new UserService();

export const swapUserRole = async (req, res, next) => {
    try {

        const email = req.params.uid;

        let dbUser = await userService.swapUserRole(email);
        res.send({ status: 'success', data: dbUser });

    } catch (error) {
        next(error)
    }
}

export const uploadDocuments = async (req, res, next) => {
    try {
        let { uid } = req.params;
        let { reference } = req.body;
        let { files } = req;

        const user = await userService.uploadFiles(uid, files, reference);
        res.redirect('/uploads');

    } catch (error) {
        next(error)
    }
};

export const findById = async (req, res) => {
    try {

        const user = await userService.findById(req.user.id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;

    } catch (error) {
        req.logger.warn(`Error getting user: ${error.message}`);
        next(error)
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.send({ status: 'success', data: users });

    } catch (err) {
        res.status(500).send({ status: 'error', message: 'An error ocurred while trying to retrieve the all users.' });
    }
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await userService.deleteInactiveUsers();
        res.send({ status: 'success', data: users });

    } catch (err) {
        res.status(500).send({ status: 'error', message: 'An error ocurred while trying to delete the inactive users.' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        let { uid } = req.params;
        const user = await userService.deleteUser(uid);

        console.log("//////services//////");
        console.log("UID");
        console.log(uid);
        console.log("user");
        console.log(user);

        res.send( { status: 'success', data: user } );

    } catch (err) {
        res.status(500).send( { status: 'error', message: 'Error deleting the user.' } );
    }
};


