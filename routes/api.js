import MongoClient from 'mongodb';
import { ObjectId } from 'mongodb';
const issue   = require('../zzz/models/Issue.js');

module.exports = (app, db) => {
  const Projects = db.collection('projects');
  const Issues  = db.collection('issues');
  
  app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));
  
  app.get('/projects', (req, res) => {
    Projects.find({}).toArray((err, docs) => {
      if (err) return res.json({docs: err});
      return res.json({docs: docs})
    });    
  });
  
  app.get('/api/issues/:project', (req, res) => {
    const getAllIssues = () => {
      const promise = new Promise((resolve, reject) => {
        Projects.findOne({title: req.params.project.replace(/\_/g, ' ')}, (err, doc) => {
          if (err) return reject(err);
          return Issues.find({for_project: doc.project_id}).toArray((err, docs) => err ? reject(err) : resolve(docs));
        });
      });
      return promise;
    };
    
    let filter = {
      length: Object.keys(req.query).length,
      names: Object.keys(req.query),
      values: Object.values(req.query),
      query: req.query,
      get open() {
        return this.names.includes('open');
      }
    };
    
    if (filter.length) {
      if (filter.open) {
        filter.query['open'] = filter.query['open'] === 'true' ? true : false;
      }
      Projects.findOne({title: req.params.project.replace(/\_/g, ' ')}, (err, doc) => {
        if (err) return res.json({docs: err});
        filter.query['for_project'] = doc.project_id;
        Issues.find(filter.query).toArray((err, docs) => {
          if (err) {
            return res.json({docs: err})
          } else {
            return res.json({docs: docs, url: req.url})
          }
        });
      });
    } else {
      getAllIssues().then(docs => docs.length ? res.json({docs: docs}) : res.json({docs: 'none'}));
    }
  });
  
  app.post('/api/issues/:project', (req, res) => {
    Projects.findOne({title: req.params.project.replace(/\_/g, ' ')}, (err, doc) => {
      if (err) return res.json({docs: err});
      
      req.body.for_project = doc.project_id;
      let new_issue = new issue(req.body);
      
      Issues.insertOne(new_issue, (err, docs) => {
        if (err) return res.json({docs: err});
        return res.json({docs: docs});
      });
    });
  });
  
  app.put('/api/issues/:project', (req, res) => {
    if (Object.keys(req.body).length) {
      let query = {_id: ObjectId(req.body._id)};
      let update = {};
    
      if (req.body.close) {
        update = { $set: {open: false, updated_on: new Date().toISOString()} };
      } else {
        update = { $set: req.body };
        delete update['$set']['_id'];
      }
      /*Issues.findOne(query, (err, docs) => {
        IF FOUND THEN ISSUES UPDATEONE
          IF UPDATEONE FAIL 
            RETURN COULD NOT UPDATE
      });*/
      Issues.updateOne(query, update, (err, docs) => {
        if (err) return res.json({result: err});
        if (docs.modifiedCount) {
          Projects.findOne({title: req.params.project.replace(/\_/g, ' ')}, (err, doc) => {
            if (err) return res.json({docs: err});
            Issues.find({for_project: doc.project_id}).toArray((err, docs) => err ? res.json({docs: err}) : res.json({docs: docs, message: 'Successfully Updated'}));
          });
        } else {
          return res.json({docs: '', message: 'could not update'});
        }
      });
    } else {
      return res.json({docs: '', message: 'no updated field sent'});
    }
  });
  
  app.delete('/api/issues/:project', (req, res) => {
    /*
      with an _id to completely delete an issue
        If no _id is sent 
          return '_id error'
        If success
          return 'deleted _id: ' + _id
        If fail
          return 'could not delete _id: ' + _id
    */
  });
      
  app.use((req, res) => res.status(404).type('text').send('Not Found'));
};


 /*Projects.findOne({title: req.params.project.replace(/\_/g, ' ')}, (err, doc) => {
        if (err) return res.json({docs: err});
        Issues.find({for_project: doc.project_id}).toArray((err, docs) => err ? res.json({docs: err}) : res.json({docs: docs}));
      });*/