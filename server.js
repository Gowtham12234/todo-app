const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
const port = 3000;
mongoose.connect("mongodb+srv://2203031240218:OjgYBNZAnPAnrESp@todo-app.xupsaqr.mongodb.net/?retryWrites=true&w=majority&appName=todo-app");

//used to parse data sent in requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serves the static html pages from public folder

app.use(express.static(path.join(__dirname, "public")));

//log-in route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "invalid credentials" });
  }
});

//new task

app.post("/addtask", async (req, res) => {
  const { username, task, date, time } = req.body;
  const newtask = new Task({ username, task, date, time, completed: false });
  await newtask.save();
  res.json({ success: true });
});

//getting tasks to display on the page

app.post("/gettasks", async (req, res) => {
  const { username } = req.body;
  const tasks = await Task.find({ username });
  res.json({ tasks });
});

// mark as completed button route

app.post("/complete-task", async (req, res) => {
  const { taskId } = req.body;
  console.log("Received taskId:", taskId);
  await Task.findByIdAndUpdate(taskId, { completed: true });
  res.json({ success: true });
});

//delete a task

app.post("/delete-task", async (req, res) => {
  const { taskId } = req.body;
  await Task.findByIdAndDelete(taskId);
  res.json({ success: true });
});

//signup route

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.json({ success: false, message: "Username already exists" });
  }
  const newUser = new User({ username, password });
  await newUser.save();

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/msg", (req, res) => {
  res.send("Server is working");
});
