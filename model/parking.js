const mongoose = require("mongoose");

const ParkingSchema = new mongoose.Schema({
  // title: { type: String, default: null },
  qrCode: { type: String, default: null },
  Lat: { type: String, default: null },
  Long: { type: String, default: null },
  User: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
});

module.exports = mongoose.model("parking", ParkingSchema);
