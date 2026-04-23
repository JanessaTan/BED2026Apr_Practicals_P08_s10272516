const express = require("express");
const app = express();
const PORT = 3000;

// Returns "Welcome to Homework API"
app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

// Route for intro page
app.get("/intro", (req, res) => {
  res.send("Wassup");
});

// Route for contact page
app.get("/name", (req, res) => {
  res.send("Janessa");
});

// Route for hobbies page (as JSON list)
app.get("/hobbies", (req, res) => {
  res.send(JSON.parse('["gaming", "drawing"]'));
});

// Route for food page
app.get("/food", (req, res) => {
  res.send("pizza, sushi");
});

// function to create the object
function Student(name, hobbies, intro) {                
    this.name = name;                
    this.hobbies = hobbies;                
    this.intro = intro;
}            
// create base and store Alex          
let alex = new Student("Alex", ["coding", "reading", "cycling"], "Hi, I'm Alex, a Year 2 student passionate about building APIs!");

// Route for student page (JSON object)
app.get("/student", (req, res) => {
  res.send(alex);
});

// Listen on the port after defining routes
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});