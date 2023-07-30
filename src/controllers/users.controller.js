import UserService from "../services/users.service.js";

const userService = new UserService();

export const swapUserRole = async (req, res, next) => {
    try {

        const email = req.params.uid;

        let dbUser = await userService.swapUserRole(email);
        res.send( { status: 'success', data: dbUser } );
        
    } catch (error) {
        next(error)
    }
}

export const uploadDocuments = async (req, res, next) => {
    try {
        let { uid } = req.params;
        let { reference } = req.body;
        let { files } = req;
        console.log("LO QUE LLEGA");
        console.log(uid);
        console.log(reference);
        console.log(files);
        
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

