var request  = require('supertest');
var db       = require('../db.js');
var config = require('../config/env.js');
var util = require('util');
var env = config.testing;
var server;
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    assert = chai.assert;
var citizen, protest;
var Factory = require('./models.js');
// Testing utilities
var u = require('./utils.js');

console.log('ENV: TEST - DB: %s - PORT: %s', env.dbName, env.dbPort);

describe("Route Specs - ", function() {
    describe("public routes - ", function() {
        var citizenData = [u.randomUser(), u.randomEmail(), 'password', 'Testville, TX', '1'];
        var protestData = ['Test Default Protest', 'This is a test protest', '2015-04-18', 42, 'Testville', 'TX'];

        before(function(done) {
            server = require('./server')();
            Factory.citizen.add(citizenData);
            Factory.protest.add(protestData);
            done();
        });

        after(function(done) {
            // Factory.clear.citizens();
            // Factory.clear.protests();
            server.close();
            done();
        });

        it("/index returns 200", function(done) {
            request(server)
                .get('/')
                .expect(200, {})
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/about returns 200", function(done) {
            request(server)
                .get('/about')
                .expect(200, {})
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/signup returns 200", function(done) {
            request(server)
                .get('/signup')
                .expect(200, {})
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/login returns 200", function(done) {
            request(server)
                .get('/login')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/signup new user", function(done) {
            request(server)
                .post('/signup')
                .set('Content-Type', 'application/json')
                .send({
                    "username": "Newuser",
                    "email": "newuser@example.com",
                    "location": "Chicago"
                })
                .expect(200)
                .expect(function(res) {
                    citizen = Factory.citizen.getByName(['Newuser'])
                    expect(citizen).to.exist
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });


        it("/protest/:id displays a protest", function(done) {
            request(server)
                .get('/protest/28')
                .expect(200, {})
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("/results displays search results", function(done) {
            request(server)
                .get('/results')
                .set('Accept', 'application/json')
                .query({search: "protest"})
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    console.log("Search results: %s", res.body.protests)
                    done();
                });
        });
    });

    describe('Users', function() {
        var citizenData = [u.randomUser(), u.randomEmail(), 'password', 'Testville, TX', '1'];
        var protestData = ['Test Default Protest', 'This is a test protest', '2015-04-18', 42, 'Testville', 'TX'];

        before(function(done) {
            server = require('./server')();
            // Factory.citizen.add(citizenData);
            // Factory.protest.add(protestData);
            done();
        });

        after(function(done) {
            // Factory.clear.citizens();
            // Factory.clear.protests();
            server.close();
            done();
        });

        it.skip("successful user login", function(done) {
            citizen = Factory.citizen.get([28])
            request(server)
                .post('/login')
                .send({"username": citizen.username, "password": "password"})
                .expect(200)
        })

        it.skip("user profile")
        it.skip("")
    })
});
