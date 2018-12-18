/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  suite('POST /api/issues/{project} => object with issue data', () => {
      let t = {
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      };
    
      test('Every field filled in', (done) => {
       chai.request(server)
        .post('/api/issues/New_Deal')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          for (let name in t) {
            assert.equal(res.obj[name], t[name]);
          }
          done();
        });
      });
      
      test('Required fields filled in', (done) => {
        chai.request(server)
        .post('/api/issues/New_Deal')
        .send({
          issue_title: 'Title2',
          issue_text: 'text2',
          created_by: 'Functional Test - Every field filled in2',
          assigned_to: 'Chai and Mocha2',
          status_text: 'In QA2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          let required = ['issue_title', 'issue_text', 'created_by'];
          required.forEach(el => assert.equal(res.obj[el], t[el] + '2'));
          done();
        });
      });
      
      test('Missing required fields', (done) => {
        chai.request(server)
        .post('/api/issues/New_Deal')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end((err, res) => {
          
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        
      });
      
      test('One field to update', function(done) {
        
      });
      
      test('Multiple fields to update', function(done) {
        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        
      });
      
      test('Valid _id', function(done) {
        
      });
      
    });

});
