import TicketManager from "../dao/db/tickets.dao";

export default class TicketService {
    
    createTicket(data){
        const { total, purchaser } = data;

        return TicketManager.createTicket({amount: total, purchaser: purchaser});
    }

};
