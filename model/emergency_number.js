const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema({
    name: { type: String, default: null },
    number: { type: String, default: null },
    Job_title:{type: String, default: null },
});

module.exports = mongoose.model("emergency_number",EmergencySchema);