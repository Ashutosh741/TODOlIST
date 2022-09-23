const mongoose = require("mongoose"); //Mongoose you already know..Not sure see the app.js file

const todoitem = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, default: "regular" },
  date: { type: String, default: "12/12/2050" },
  isCompleted: { type: Boolean, default: false },
}); // We declared the structure of todoitem ..see UserData--->todos

const UserData = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avtaar: { type: String, default: "avtaar-0" },
  todos: [todoitem],
}); // This is how we are storing the user's data in mongodb

const model = mongoose.model("UserData", UserData); // we are sving this as model...

module.exports = model; // exporting model to use it in different file
