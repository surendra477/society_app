require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const User = require("./model/user");
const Meeting = require("./model/meeting");
const auth = require("./middleware/auth");
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//meeting goes here

app.get("/api/meeting" , async (req, res) => {
    try{
        const meetingsList = await Meeting.find()
        console.log();
    }
    catch{

    }
})

// Logic goes here
app.post("/api/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { name, room_number, building_number, password,email } = req.body;
  
      // Validate user input
      if (!(email && password && name && room_number  && building_number)) {
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


app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
module.exports = app;

app.listen(process.env.PORT || "3000", () => {
  console.log(`Server running on port 3000`);
});
