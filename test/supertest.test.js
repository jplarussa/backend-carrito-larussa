import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";


const expect = chai.expect;
const requester = supertest('http://localhost:4000');

describe("Integration test - Ecommerce App", () => {

    describe("API Session Test", () => {

        before(async function () {
            this.cookie;
            this.mockUser = {
                email: "someone@gmail.com",
                password: "somePass",
                first_name: "SomeName",
                last_name: "SomeLastName",
                age: 50,
                role: "admin"
            }
        })

/*         beforeEach(function(){
            this.timeout(4000);
            mongoose.connection.collections.users.drop();
        }); */

        it("Register user - POST /api/sessions/register", async function(){
            const {statusCode, ok, _body} = await requester.post("/api/sessions/register").send(this.mockUser);
            expect(statusCode).to.be.eql(201)
            expect(_body.message).to.be.deep.equal('Success')
        });

        it("Login user and set cookie- POST /api/sessions/login", async function(){

            const result = await requester.post("/api/sessions/login").send({ email: this.mockUser.email, password: this.mockUser.password});
            const cookieResult = result.headers['set-cookie'][0];

            expect(result.statusCode).to.be.eql(200)
            expect(result._body.success).to.be.ok

            const cookieData = cookieResult.split('=');
            this.cookie = {
                name: cookieData[0], 
                value: cookieData[1]
            };

            expect(this.cookie.name).to.be.ok.and.eql('jwtCookieToken');
            expect(this.cookie.value).to.be.ok
        });

        it("Endpoint Current have a user with cookie - GET /api/sessions/current", async function() {
            const{ _body, } = await requester.get("/api/sessions/current").set("Cookie", [`${this.cookie.name}=${this.cookie.value}`])
            console.log( _body);
            expect(_body.email).to.be.ok.and.eql("someone@gmail.com")

        })

    });

});