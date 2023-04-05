import passport from 'passport'
import passportLocal from 'passport-local'
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../util.js'

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            const { first_name, last_name, email, age } = req.body;

            try {

                const userExists = await userModel.findOne({ email });
                if (userExists) {
                    console.log("User already exist.");
                    return done(null, false);
                }

                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                }

                const result = await userModel.create(user);
                return done(null, result);

            } catch (error) {
                return done("Error getting user: " + error + " "+err.message)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                console.log("User finded for login:");
                console.log(user);

                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
                }

                return done(null, user);

            } catch (error) {
                return done(error);
            }
        })
    );



    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.4d4b8a6588882d1e',
            clientSecret: 'c678d9b2d4c63257d0e3bc3faa05211664f0c6c4',
            callbackUrl: 'http://localhost:8080/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtained from user: ");
            console.log(profile);
            try {
                const user = await userModel.findOne({
                    email: profile._json.email
                });

                console.log("User finded for login: "+user);

                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);

                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: '',
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    };

                    const result = await userModel.create(newUser);
                    return done(null, result);
                    
                } else {
                    return done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        })
    );


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);

        } catch (error) {
            console.error("Error deserializing the user: " + error);
        }
    });
}

export default initializePassport;

