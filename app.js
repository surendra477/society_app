require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
//const User = require("./model/user");
const meetings = require("./model/meetings");
const auth = require("./middleware/auth");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const emergency_number = require("./model/emergency_number");
const notice = require("./model/notice");
const parking = require("./model/parking");
const event = require("./model/event");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//meeting goes here

app.get("/api/emergency_number", async (req, res) => {
  try {
    const emergencyNumberList = await emergency_number.find();
    // console.log(emergencyNumberList);
    let data = { emergencyNumberList };
    // console.log(meeetngs);
    res.status(201).json(data);
  } catch {
    console.log(err);
  }
});

app.get("/api/parking", auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log(userId);
    const query = {
      User: userId,
    };
    const myParking = await parking.find(query);
    const otherSpots = {
      User: {
        $ne: mongoose.Types.ObjectId(userId),
      },
    };

    console.log(otherSpots);

    const otherParking = await parking.find(otherSpots);
    console.log(otherParking);

    const result = {
      userParking: myParking,
      otherParking: otherParking,
    };

    res.status(201).json(result);
  } catch {
    console.log(err);
    res.status(401).json({ message: err });
  }
});

app.post("/api/parking", auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log(userId);
    const { qrCode } = req.body;
    const query = {
      qrCode,
    };

    const parkingSpot = await parking.findOne(query);
    if (parkingSpot && !parkingSpot.User) {
      const update = {
        $set: {
          User: userId,
        },
      };
      const result = await parking.findOneAndUpdate(query, update);
      console.log(result);
      res
        .status(201)
        .json({ isParked: true, message: "Car parked successfully" });
    } else {
      res
        .status(201)
        .json({ isParked: false, message: "Parking spot occupied already" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ isParked: false, message: err });
  }
});

app.delete("/api/parking", auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log(userId);
    const { qrCode } = req.body;
    const query = {
      qrCode,
    };

    const parkingSpot = await parking.findOne(query);
    if (parkingSpot && parkingSpot.User && parkingSpot.User == userId) {
      const update = {
        $set: {
          User: null,
        },
      };
      const result = await parking.findOneAndUpdate(query, update);
      console.log(result);
      res.status(201).json({ status: true, message: "Parking cleared" });
    } else {
      res.status(201).json({ status: false, message: "Unsuccessful" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ status: false, message: err });
  }
});

app.get("/api/notice", async (req, res) => {
  try {
    const noticeList = await notice.find();
    //console.log(noticeList);
    let data = { noticeList };
    res.status(201).json(data);
  } catch {
    console.log(err);
  }
});

app.get("/api/meeting", async (req, res) => {
  try {
    const meetingsList = await meetings.find();
    //console.log(meetingsList);
    let data = { meetingsList };
    // console.log(meeetngs);
    res.status(201).json(data);
  } catch {
    console.log(err);
  }
});

// Logic goes here
app.post("/api/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { name, room_number, building_number, password, email } = req.body;

    // Validate user input
    if (!(email && password && name && room_number && building_number)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      room_number,
      building_number,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "365d",
      }
    );
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.get("/api/events", async (req, res) => {
  try {
    const eventList = await event.find();
    //console.log(noticeList);
    let data = { eventList };
    res.status(201).json(data);
  } catch {
    console.log(err);
  }
});

app.post("/api/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
module.exports = app;

app.listen(process.env.PORT || "3001", () => {
  console.log(`Server running on port 3001`);
});
