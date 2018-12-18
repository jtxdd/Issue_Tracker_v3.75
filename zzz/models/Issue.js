const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Issue = new mongoose.Schema({
  issue_title: String,
  issue_text:  String,
  created_by:  String,
  assigned_to: String,
  status_text: String,
  created_on:  {type: Date, default: Date.now},
  updated_on:  {type: Date, default: Date.now},
  open:        {type: Boolean, default: true},
  for_project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
});

module.exports = mongoose.model('Issue', Issue);