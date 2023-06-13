export default class UserDTO {
    constructor(user){
        // Send this information alone for current
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.role = user.role,
        this.email = user.email,
        this.password = user.password,
        this.age = user.age
    }
}