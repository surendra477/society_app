const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    title: { type: String, default: null },
    time: { type: String, default: null },
    agenda:{type: String, default: null },
    description: { type: String, default: null },
});

module.exports = mongoose.model("meetings", userSchema);
