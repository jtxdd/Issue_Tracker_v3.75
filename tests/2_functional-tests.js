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

const t = [
  {
    issue_title: 'Title',
    issue_text: 'text',
    created_by: 'Functional Test - Every field filled in',
    assigned_to: 'Chai and Mocha',
    status_text: 'In QA'
  },
  {
    issue_title: 'Title2',
    issue_text: 'text2',
    created_by: 'Functional Test - Every field filled in2',
    assigned_to: 'Chai and Mocha2',
    status_text: 'In QA2'
  },
  {
    issue_title: '',
    issue_text: '',
    created_by: '',
    assigned_to: 'Chai and Mocha',
    status_text: 'In QA'
  },
  {
    //empty on purpose
  },
  {
    _id: '5c1ae3f566e0a153202b402f',
    issue_text: 'chai test put'
  },
  {
    _id: '5c1ae3f566e0a153202b402f',
    issue_text: 'chai multi test put',
    created_by: 'chai',
    assigned_to: 'mocha'
  },
];

suite('Functional Tests', () => {
  
  suite('POST /api/issues/{project} => object with issue data', () => {
    
    test('Every field filled in', (done) => {
      chai.request(server)
      .post('/api/issues/New_Deal')
      .send(t[0])
      .end((err, res) => {
        let { issue_title, issue_text, created_by, assigned_to, status_text } = res.body.value;
        assert.equal(res.status, 200);
        assert.equal(t[0].issue_title, issue_title);
        assert.equal(t[0].issue_text, issue_text);
        assert.equal(t[0].created_by, created_by);
        assert.equal(t[0].assigned_to, assigned_to);
        assert.equal(t[0].status_text, status_text)
        done();
      });
    });
  
    test('Required fields filled in', (done) => {
      chai.request(server)
      .post('/api/issues/New_Deal')
      .send(t[1])
      .end((err, res) => {
        assert.equal(res.status, 200);
        let { issue_title, issue_text, created_by } = res.body.value;
        assert.equal(t[1].issue_title, issue_title);
        assert.equal(t[1].issue_text, issue_text);
        assert.equal(t[1].created_by, created_by);
        done();
      });
    });
  
    test('Missing required fields', (done) => {
      chai.request(server)
      .post('/api/issues/New_Deal')
      .send(t[2])
      .end((err, res) => {
        assert.equal(res.text, 'Missing required fields');
        done();
      });
    });
  });
  
  suite('PUT /api/issues/{project} => text', () => {
      
    test('No body', (done) => {
      chai.request(server)
      .put('/api/issues/New_Deal')
      .send(t[3])
      .end((err, res) => {
        assert.equal(res.text, 'No body');
        done();
      });
    });
      
    test('One field to update', (done) => {
      chai.request(server)
      .put('/api/issues/New_Deal')
      .send(t[4])
      .end((err, res) => {
        let { issue_text } = res.body.docs.value;
        assert.equal(t[4].issue_text, issue_text);
        done();
      });
    });
      
    test('Multiple fields to update', (done) => {
      chai.request(server)
      .put('/api/issues/New_Deal')
      .send(t[5])
      .end((err, res) => {
        let { issue_text, created_by, assigned_to } = res.body.docs.value;
        assert.equal(t[5].issue_text, issue_text);
        assert.equal(t[5].created_by, created_by);
        assert.equal(t[5].assigned_to, assigned_to);
        done();
      });
    });
  });
  
  suite('GET /api/issues/{project} => Array of objects with issue data', () => {
      
    test('No filter', (done) => {
      chai.request(server)
      .get('/api/issues/New_Deal')
      .query({})
      .end((err, res) => {
        assert.isArray(res.body.docs);
        assert.property(res.body.docs[0], 'issue_title');
        assert.property(res.body.docs[0], 'issue_text');
        assert.property(res.body.docs[0], 'created_on');
        assert.property(res.body.docs[0], 'updated_on');
        assert.property(res.body.docs[0], 'created_by');
        assert.property(res.body.docs[0], 'assigned_to');
        assert.property(res.body.docs[0], 'open');
        assert.property(res.body.docs[0], 'status_text');
        assert.property(res.body.docs[0], '_id');
        done();
      });
    });
      
    test('One filter', (done) => {
      chai.request(server)
      .get('/api/issues/New_Deal')
      .query({open: true})
      .end((err, res) => {
        res.body.docs.forEach(el => {
          assert.propertyVal({open: true}, 'open', true);
        });
        done();
      });
    });
      
    test('Multiple filters (test for multiple fields you know will be in the db for a return)', (done) => {
      chai.request(server)
      .get('/api/issues/New_Deal')
      .query({open: true, created_by: 'Jordan Todd'})
      .end((err, res) => {
        res.body.docs.forEach(el => {
          assert.propertyVal({open: true}, 'open', true);
          assert.propertyVal({created_by: 'Jordan Todd'}, 'created_by', 'Jordan Todd');
        });
        done();
      });
    });
  });
  
  suite('DELETE /api/issues/{project} => text', () => {
      
    test('No _id', (done) => {
      chai.request(server)
      .delete('/api/issues/New_Deal')
      .send({})
      .end((err, res) => {
        assert.equal(res.body.message, '_id error; no _id');
        done();
      });
    });
      
    test('Valid _id', (done) => {
      chai.request(server)
      .delete('/api/issues/New_Deal')
      .send({_id: '5c1c28f752564f7494513ba1'})
      .end((err, res) => {
        assert.equal(res.body.message, 'Deleted _id: 5c1c28f752564f7494513ba1');
        done();
      });
    });
  });
});