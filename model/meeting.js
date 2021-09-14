const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    title: { type: String, default: null },
    agenda:{type: String, default: null },
    description: { type: String, default: null },
});

module.exports = mongoose.model("mettings", userSchema);
