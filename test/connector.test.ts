import * as Assert from "assert";
import * as Sinon from "sinon";
import {Connector} from "../dist/connector";
import * as Stream from "stream"
import {OauthTokenInterface} from "../src/connector";

describe("api-connector", () => {

    const authString = "Bearer";
    const token = "4384j4k3j2h4kj3bihf";

    let connector = new Connector();
    let fakeRequest: any = null;

    /*
     *  Create Oauth Token Interface Stub
     */

    const tokenStub = class TokenStub implements OauthTokenInterface {

        getAuthorizationString(): string {
            return authString + ' ' + token;
        }

        getToken(): string {
            return token;
        }

    };

    /*
     *  Define some actions performed before each test
     */

    beforeEach(() => {

        fakeRequest = Sinon.stub(connector.handler, "request");

        connector.setToken(new tokenStub());

    });

    /*
     *  Define some action performed after each test
     */

    afterEach(() => {

        const handler: any = connector.handler;

        handler.request.restore();

    });

    /**
     *  Perform Get Request
     */
    it("Should make Get Request", () => {

        let passResponse = new Stream.PassThrough();
        const anyResponse: any = passResponse;
        passResponse.write(JSON.stringify({data: "data"}));
        passResponse.end();
        anyResponse.statusCode = 200;

        let passRequest = new Stream.PassThrough();

        fakeRequest.callsArgWith(1, passResponse).returns(passRequest);

        connector.get("/path/to/something", {}, {}).then((response) => {

            Assert.equal(response.status,
                200,
                "Status should be HTTP OK");

            Assert.equal(response.message,
                '{"data":"data"}',
                "Should return proper passed value");

            Assert.equal(response.originPath,
                "/api/v1/path/to/something",
                "Should return proper path");

            Assert.equal(response.originHeaders.Authorization,
                authString + ' ' + token,
                "Should have token applied");

            Assert.equal(response.originMethod,
                "GET",
                "Should have proper method for request");

        });

    });

    /**
     *  Perform Post Request
     */
    it("Should make Post Request", () => {

        const testData: string = JSON.stringify({data: "data"});

        let passResponse = new Stream.PassThrough();
        const anyResponse: any = passResponse;
        passResponse.write(testData);
        passResponse.end();
        anyResponse.statusCode = 200;

        let passRequest = new Stream.PassThrough();
        let writeHook = Sinon.spy(passRequest, "write");

        fakeRequest.callsArgWith(1, passResponse).returns(passRequest);

        connector.post("/path/to/something", {}, {data: "data"}).then((response) => {

            Assert.equal(response.status,
                200,
                "Status should be HTTP OK");

            Assert.equal(response.message,
                '{"data":"data"}',
                "Should return proper passed value");

            Assert.equal(response.originPath,
                "/api/v1/path/to/something",
                "Should return proper path");

            Assert.equal(response.originHeaders.Authorization,
                authString + ' ' + token,
                "Should have token applied");

            Assert.equal(response.originMethod,
                "POST",
                "Should have proper method for request");

            Assert.equal(writeHook.withArgs(testData).calledOnce,
                true,
                "Post data should be passed within request");

        });

    });

    /**
     *  Perform Put Request
     */
    it("Should make Put Request", () => {

        const testData: string = JSON.stringify({data: "data"});

        let passResponse = new Stream.PassThrough();
        const anyResponse: any = passResponse;
        passResponse.write(testData);
        passResponse.end();
        anyResponse.statusCode = 200;

        let passRequest = new Stream.PassThrough();
        let writeHook = Sinon.spy(passRequest, "write");

        fakeRequest.callsArgWith(1, passResponse).returns(passRequest);

        connector.put("/path/to/something", {}, {data: "data"}).then((response) => {

            Assert.equal(response.status,
                200,
                "Status should be HTTP OK");

            Assert.equal(response.message,
                '{"data":"data"}',
                "Should return proper passed value");

            Assert.equal(response.originPath,
                "/api/v1/path/to/something",
                "Should return proper path");

            Assert.equal(response.originHeaders.Authorization,
                authString + ' ' + token,
                "Should have token applied");

            Assert.equal(response.originMethod,
                "PUT",
                "Should have proper method for request");

            Assert.equal(writeHook.withArgs(testData).calledOnce,
                true,
                "Post data should be passed within request");

        });

    });

    /**
     *  Perform Patch Request
     */
    it("Should make Patch Request", () => {

        const testData: string = JSON.stringify({data: "data"});

        let passResponse = new Stream.PassThrough();
        const anyResponse: any = passResponse;
        passResponse.write(testData);
        passResponse.end();
        anyResponse.statusCode = 200;

        let passRequest = new Stream.PassThrough();
        let writeHook = Sinon.spy(passRequest, "write");

        fakeRequest.callsArgWith(1, passResponse).returns(passRequest);

        connector.patch("/path/to/something", {}, {data: "data"}).then((response) => {

            Assert.equal(response.status,
                200,
                "Status should be HTTP OK");

            Assert.equal(response.message,
                '{"data":"data"}',
                "Should return proper passed value");

            Assert.equal(response.originPath,
                "/api/v1/path/to/something",
                "Should return proper path");

            Assert.equal(response.originHeaders.Authorization,
                authString + ' ' + token,
                "Should have token applied");

            Assert.equal(response.originMethod,
                "PATCH",
                "Should have proper method for request");

            Assert.equal(writeHook.withArgs(testData).calledOnce,
                true,
                "Post data should be passed within request");

        });

    });

    /**
     *  Perform Delete Request
     */
    it("Should make Delete Request", () => {

        let passResponse = new Stream.PassThrough();
        const anyResponse: any = passResponse;
        passResponse.write(JSON.stringify({data: "data"}));
        passResponse.end();
        anyResponse.statusCode = 200;

        let passRequest = new Stream.PassThrough();

        fakeRequest.callsArgWith(1, passResponse).returns(passRequest);

        connector.delete("/path/to/something", {}, {}).then((response) => {

            Assert.equal(response.status,
                200,
                "Status should be HTTP OK");

            Assert.equal(response.message,
                '{"data":"data"}',
                "Should return proper passed value");

            Assert.equal(response.originPath,
                "/api/v1/path/to/something",
                "Should return proper path");

            Assert.equal(response.originHeaders.Authorization,
                authString + ' ' + token,
                "Should have token applied");

            Assert.equal(response.originMethod,
                "DELETE",
                "Should have proper method for request");

        });

    });

});