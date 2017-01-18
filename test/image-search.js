var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var app = require('../server');
var db = require('../db');


chai.use(chaiHttp);

before(function (done) {
    console.log("Setting up database");
    db.connect()
        .then(() => done())
        .catch(e => done(e));
});

describe('/api/imagesearch/[search term]', function () {
    var response;
    before(function (done) {
        chai.request(app)
            .get('/api/imagesearch/cats')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                response = res;
                done();
            });
    });

    it('should return a 200 response', function (done) {
        expect(response).to.have.status(200);
        done();
    });

    it('should return a json object', function (done) {
        expect(response).to.be.json;
        done();
    });

    it('should return an array', function (done) {
        expect(response.body).to.be.an('Array');
        done();
    });

    it('should have the correct fields (url/snippet/thumbnail/context)', function (done) {
        expect(response.body[0]).to.have.property('url');
        expect(response.body[0]).to.have.property('snippet');
        expect(response.body[0]).to.have.property('thumbnail');
        expect(response.body[0]).to.have.property('context');
        done();
    });
});

describe('/api.imagesearch/[search term]?offset=30', function () {
    var response;
    before(function (done) {
        chai.request(app)
            .get('/api/imagesearch/cats?offset=30')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                response = res;
                done();
            });
    });

    it('should return a 200 response', function (done) {
        expect(response).to.have.status(200);
        done();
    });

    it('should return a json object', function (done) {
        expect(response).to.be.json;
        done();
    });

    it('should return an array', function (done) {
        expect(response.body).to.be.an('Array');
        done();
    });

    it('should have the correct fields (url/snippet/thumbnail/context)', function (done) {
        expect(response.body[0]).to.have.property('url');
        expect(response.body[0]).to.have.property('snippet');
        expect(response.body[0]).to.have.property('thumbnail');
        expect(response.body[0]).to.have.property('context');
        done();
    });
});

describe('/api/latest/imagesearch', function () {
    var response;
    before(function (done) {
        chai.request(app)
            .get('/api/latest/imagesearch')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                response = res;
                done();
            });
    });

    it('should return a 200 response', function (done) {
        expect(response).to.have.status(200);
        done();
    });

    it('should return a json object', function (done) {
        expect(response).to.be.json;
        done();
    });

    it('should return an array', function (done) {
        expect(response.body).to.be.an('Array');
        done();
    });

    it('should have the correct fields (term/when)', function (done) {
        expect(response.body[0]).to.have.property('term');
        expect(response.body[0]).to.have.property('when');
        done();
    });
});