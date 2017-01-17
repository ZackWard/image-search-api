var chai = require('chai');
var chaiHttp = require('chai-http');


chai.use(chaiHttp);

before(function (done) {
    console.log("Setting up database");
    done();
});

describe('/api/imagesearch/[search term]', function () {
    it('should return a 200 response');
    it('should return a json object');
    it('should return an array');
    it('should have the correct fields (url/snippet/thumbnail/context)');
});

describe('/api/latest/imagesearch', function () {
    it('should return a 200 response');
    it('should return a json object');
    it('should return an array');
    it('should have the correct fields (term/when)');
});