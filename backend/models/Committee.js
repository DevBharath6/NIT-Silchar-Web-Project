const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  memberRole: { type: String },        
  bullets: [{ type: String }]          
});

const CommitteeSchema = new mongoose.Schema(
  {
    sectionTitle: { type: String, required: false },   
    sectionDescription: { type: String },             
    cardTitle: { type: String, required: true },      
    roles: [RoleSchema]                               
  },
  { timestamps: true }
);

module.exports = mongoose.model("Committee", CommitteeSchema);
