import dotenv from 'dotenv';
import {Command} from 'commander';

const program = new Command(); //Crea la instancia de comandos de commander.

program
    .option('-d', 'Variable for debug', false)
    .option('-p <port>', 'Server port', 8080)
    .option('--mode <mode>', 'Workmode', 'develop')
program.parse();

//console.log("Options: ", program.opts());
console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path:environment==="production"?"./src/config/.env.production":"./src/config/.env.development"
});


export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    GHclientID: process.env.GHCLIENTID,
    GHClientSecret: process.env.GHCLIENTSECRET,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY
};