
const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  
    title:{type: String, default: null },
    description: { type: String, default: null },
});

module.exports = mongoose.model("notice",NoticeSchema);
