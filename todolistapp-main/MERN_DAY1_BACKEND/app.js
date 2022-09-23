// If this file run's in one go..then conratulations.. If not then try to understand why it's not running probabbly you have missed reading comment or something important..

// Ask any doubts on discord...

/////////Mongo DB Note --- Add this in allowed Ip section , it will allow you to run this code from any machine  0.0.0.0/0

const express = require("express"); // framework for setting up the server (We can setup server without using the express, but express makes it easy and fast to setup the webserver.)
const mongoose = require("mongoose"); //mongoose is a package to connect to mongoDB database Server, As mongoDb is Schemaless, using mongoose enforces developer to use a schema...so to make errors less probbable.
const model = require("./models/usermodel"); // we are importing the schema model...
const bcrypt = require("bcrypt"); //  JS Library of bcrypt..used to convert password in hash....
const jwt = require("jsonwebtoken"); // A library to implement JWT (JSON WEB TOKEN)

const app = express(); //We are intializing a server instance to app varibale.

app.use(express.json()); // Middleware used to parse JSON Data. It identifies the body as JSON string and converts it to JavaScript Object before reaching to the API routes callback, hence called middleware....

const mongo_url = "<put your mongodb URI here>"; // Keep this URI a secret :-) And while pasting this URI that you got from atlas read ..URI correctly..it needs some unfilled information

mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //connect method is used to connect the server to mongodb database server...

const port = process.env.PORT || 5000; // When hosting on heroku the port is generally stored as environment varibale..

const salt = 12; // we generally store SALT as an environment variable...

const privateKey = "somerandomkeyahjsxdhasdashbsaxT0do1@#$%^^"; //this is also stored as an environmet varibale ....we have stored it in varible for security purposes.......This is private key used to sign JWT (Json Web token..)

// Anyone can access registration and login routes..
app.post("/register", async (req, res) => {
  const { name, userName, password } = req.body;

  const avtaar = +Math.floor(Math.random() * 3) + 1; // generating a random number for assigning the avtaar

  const encryptedPassword = await bcrypt.hash(password, salt); // we are hashing the plain text password here....

  try {
    const newUser = await model.create({
      // creating a document for a particular user...
      username: userName,
      password: encryptedPassword,
      name: name,
      avtaar: avtaar,
    });

    res.json({ status: "true", message: "User registered." });
  } catch (err) {
    if (err.code == "11000") {
      res.json({ status: "false", message: "Username is taken." });
    } else {
      res.json({ status: "false", message: "Some error occurred." });
    }
  }
});

app.post("/login", async (req, res) => {
  const { userName, password: userPassword } = req.body;

  try {
    const databaseuser = await model.findOne({ username: userName }); // We are finding the user in the database...whoose username mathces with the username entered by the user...

    if (databaseuser) {
      var ePass = databaseuser.password;
      const isPassCorrect = await bcrypt.compare(userPassword, ePass); // we are checking if eneterd password's hash matches with the one stored in the mongoDB database...

      if (isPassCorrect) {
        const userToken = await jwt.sign(
          { userName: databaseuser.username, id: databaseuser._id },
          privateKey
        ); // We are creating a JWT by signing it with secret key

        res.json({
          status: "true",
          message: "Login Successful",
          token: userToken,
        });
      } else {
        res.json({ status: "false", message: "Password/Username incorrect !" });
      }
    } else {
      res.json({ status: "false", message: "Password/Username incorrect !" });
    }
  } catch (err) {
    res.json({
      status: "false",
      message: "Some Error Occured, try reloading the page!",
    });
  }
});

//////////////////////////////////////////////////////

//Proteceted Routes -- these routes only accesed when user will have valid jwwt token
app.post("/getdetails", async (req, res) => {
  const { token } = req.body; // we just sent token from the frontend to get the data

  try {
    const userDetails = jwt.verify(token, privateKey); //So we check if JWT token is valid and hasn't been tampered, if everthing is alright we just retuen the Payload that we passed above..(See login api's route)
    if (userDetails) {
      const userName = userDetails.userName;

      try {
        const databaseuser = await model.findOne({ username: userName });

        res.json({
          status: "true",
          message: "user details",
          userDetails: {
            name: databaseuser.name,
            avtaar: databaseuser.avtaar,
            todos: databaseuser.todos,
          },
        });
      } catch (err) {
        res.json({ status: "false", message: "user not verified" });
      }
    } else {
      res.json({ status: "false", message: "user not verified" });
    }
  } catch (err) {
    res.json({ status: "false", message: "user auth invalid" });
  }
});

app.post("/addtodo", async (req, res) => {
  const { token, text, priority, isCompleted, date } = req.body;

  try {
    const userDetails = jwt.verify(token, privateKey);
    if (userDetails) {
      const userName = userDetails.userName;

      try {
        const addtodo = await model.updateOne(
          { username: userName },
          {
            $push: {
              todos: {
                text: text,
                priority: priority,
                isCompleted: isCompleted,
                date: date,
              },
            },
          }
        );
        const databaseuser = await model.findOne({ username: userName });

        res.json({
          status: "true",
          message: "todo added",
          userDetails: { todos: databaseuser.todos },
        }); //specific todo details to be sent
      } catch (err) {}
    } else {
      res.json({ status: "false", message: "user not verified" });
    }
  } catch (err) {
    res.json({ status: "false", message: "user not verified" });
  }
});

app.post("/deletetodo", async (req, res) => {
  const { token, id } = req.body;
  try {
    const userDetails = jwt.verify(token, privateKey);
    if (userDetails) {
      const userName = userDetails.userName;
      const idTodo = id;

      try {
        const deleteTodo = await model.updateOne(
          { $and: [{ username: userName }, { "todos._id": idTodo }] },
          {
            $pull: {
              todos: {
                _id: idTodo,
              },
            },
          }
        );
        const databaseuser = await model.findOne({ username: userName });

        res.json({
          status: "true",
          message: "todo deleted",
          userDetails: { todos: databaseuser.todos },
        }); //specific todo details to be sent
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({ status: "false", message: "user not verified" });
    }
  } catch (err) {
    res.json({ status: "false", message: "user not verified" });
  }
});

app.post("/edittodo", async (req, res) => {
  const { token, id, text, priority, date } = req.body;

  try {
    const userDetails = jwt.verify(token, privateKey);
    if (userDetails) {
      const userName = userDetails.userName;

      try {
        const editodo = await model.updateOne(
          {
            $and: [{ username: userName }, { "todos._id": id }],
          },
          {
            $set: {
              "todos.$.text": text,
              "todos.$.priority": priority,
              "todos.$.date": date,
            },
          }
        );

        const databaseuser = await model.findOne({ username: userName });

        res.json({
          status: "true",
          message: "todo edited",
          userDetails: { todos: databaseuser.todos },
        }); //specific todo details to be sent
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({ status: "false", message: "user not verified" });
    }
  } catch (err) {
    res.json({ status: "false", message: "user not verified" });
  }
});

app.post("/completedtodo", async (req, res) => {
  const { token, id, isCompleted } = req.body;

  try {
    const userDetails = jwt.verify(token, privateKey);
    if (userDetails) {
      const userName = userDetails.userName;

      try {
        const completedtodo = await model.updateOne(
          {
            $and: [{ username: userName }, { "todos._id": id }],
          },
          {
            $set: {
              "todos.$.isCompleted": isCompleted,
            },
          }
        );

        const databaseuser = await model.findOne({ username: userName });

        res.json({
          status: "true",
          message: "complted status changed",
          userDetails: { todos: databaseuser.todos },
        }); //specific todo details to be sent
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({ status: "false", message: "user not verified" });
    }
  } catch (err) {
    res.json({ status: "false", message: "user not verified" });
  }
});

// End of Protected Routes

// Set server to Listen State
app.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});
