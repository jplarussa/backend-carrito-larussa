export default class CustomError {
    static createError({statusCode = 500, name = "Error", cause, message, code = 1}) {
        const error = new Error(message, {cause});
        error.status = statusCode;
        error.name= name;
        error.code= code;
        console.log("ESTO SALE DEL CUSTOM:");
        console.log(error.code);
        console.log(error.statusCode);
        throw error;
    };
}