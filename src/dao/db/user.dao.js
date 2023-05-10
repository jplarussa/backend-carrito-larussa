import {userModel} from "./models/user.model.js";

export default class UserManager {

    async createUser(user) {
        try {
            const newUser = new userModel(user);
            const savedUser = await newUser.save();
            return savedUser;
          } catch (error) {
            throw new Error('Error creating user.');
          }
      };


}