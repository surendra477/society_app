
const mongoose = require("mongoose");

const ComplaintsSchema = new mongoose.Schema({
    //name: { type: String, default: null },
   // time: { type: String, default: null },
    title:{type: String, default: null },
    description: { type: String, default: null },
    image: { type: String, default: null },
});

module.exports = mongoose.model("complaint", ComplaintsSchema);