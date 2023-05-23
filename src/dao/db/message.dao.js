import {messagesModel} from "../../dao/db/models/messages.model.js";

export default class MessageService {

    async addMessage(newMessage) {
        try {
            let message = await messagesModel.create(newMessage);
            req.logger.debug(`Message Added: ${message}`);

            return {
                success: true,
                message: `Message ${message.message} added successfully`
            };
        } catch (error) {
            return error;
        }
    };
};