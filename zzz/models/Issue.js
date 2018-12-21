const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Issue = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text:  { type: String, required: true },
  created_by:  { type: String, required: true },
  assigned_to: { type: String },
  status_text: { type: String },
  created_on:  { type: Date,    default: Date.now },
  updated_on:  { type: Date,    default: Date.now },
  open:        { type: Boolean, default: true     },
  for_project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Issue', Issue);