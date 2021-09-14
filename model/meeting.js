const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    time: { type: String, default: null },
    title: { type: String, default: null },
    agenda_description: { type: String, default: null },
});

module.exports = mongoose.model("metting", userSchema);