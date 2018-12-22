import MongoClient from 'mongodb';
import { ObjectId } from 'mongodb';
const issue  = require('../models/Issue.js');

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
    const validPost = () => {
      let valid = true;
      [req.body.issue_title, req.body.issue_text, req.body.created_by].forEach(el => {
        if (!el) {
          valid = false;
        }
      });
      return valid;
    };
    
    if (validPost()) {
      Projects.findOne({title: req.params.project.replace(/\_/g, ' ')}, (err, doc) => {
        if (err) return res.json({docs: '', message: err});
      
        req.body.for_project = doc.project_id;
        let new_issue = new issue(req.body);
      
        Issues.insertOne(new_issue, (err, docs) => {
          if (err) return res.json({docs: '', message: err});
        
          return res.json({docs: docs, value: new_issue, message: 'Successfully inserted'});
        });
      });
    } else {
      //return res.json({docs: '', message: 'Invalid post, missing required fields'});
      return res.status(400).send('Missing required fields');
    }
  });
  
  app.put('/api/issues/:project', (req, res) => {
    if (Object.keys(req.body).length) {
      let validId = req.body._id ? (req.body._id.length === 24 ? true : false) : (false);
      
      if (validId) {
        let query = {_id: ObjectId(req.body._id)};
        let update = {};
    
        if (req.body.close) {
          update = { $set: {open: false, updated_on: new Date().toISOString()} };
        } else {
          update = { $set: req.body };
          delete update['$set']['_id'];
        }
      
        Issues.findOneAndUpdate(query, update, {returnOriginal: false}, (err, docs) => {
          if (err) {
            return res.json({docs: '', message: err});
          } else {
            return res.json({docs: docs, message: 'Successfully updated'});
          }
        });
      } else {
        return res.json({docs: '', message: 'could not update _id: ' + req.body._id});
      } 
    } else {
      //return res.json({docs: '', message: 'no updated field sent'});
      return res.status(400).send('No body');
    }
  });
  
  app.delete('/api/issues/:project', (req, res) => {
    if (Object.keys(req.body).length) {
      let validId = req.body._id ? (req.body._id.length === 24 ? true : false) : (false);
      
      if (validId) {
        let query = {_id: ObjectId(req.body._id)};
        
        Issues.findOneAndDelete(query, (err, docs) => {
          if (err) return res.json({docs: '', message: err});
          return res.json({docs: docs, message: 'Deleted _id: ' + req.body._id});
        });
      } else {
        return res.json({docs: '', message: 'could not delete _id: ' + req.body._id});
      }
    } else {
      return res.json({docs: '', message: '_id error; no _id'});
    }
  });
      
  app.use((req, res) => res.status(404).type('text').send('Not Found'));
};