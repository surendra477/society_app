const mongoose = require("mongoose");

const ParkingSchema = new mongoose.Schema({
   // title: { type: String, default: null },
    qrCode: { type: String, default: null },
    Location:{type: String, default: null },
    User: { type:mongoose.Schema.Types.ObjectId,
        ref:'user', },
});

module.exports = mongoose.model("parking", ParkingSchema);