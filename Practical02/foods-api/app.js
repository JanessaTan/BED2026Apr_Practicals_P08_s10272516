const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let foods = [];
app.post("/foods", (req, res) => { // POST method creates a new food resource.
  const { name, calories } = req.body; // checks that both name and calories are provided in the request body.
  // If either is missing, it responds with a 400 status code.
  if (!name || calories == null) {
    return res
      .status(400)
      .json({ message: "Cannot create food: name and calories are required." });
  }
   // If valid, it generates a new food object with a unique id (using Date.now()), adds it to the foods array, and returns a 201 status code.
  const newFood = { id: Date.now(), name, calories };
  foods.push(newFood);
  res
    .status(201)
    .json({ message: "Food created successfully.", food: newFood });
});

app.get("/foods", (req, res) => { // GET method retrieves all food items in the foods array.
  const { name } = req.query; // optional query parameter name to filter foods by their name.
  let results = foods;
  // If a name is provided, it filters the foods array and returns a filtered list.
  if (name) {
    results = foods.filter((f) => f.name.includes(name));
    return res.json({
      message: `Found ${results.length} food(s) matching name filter.`,
      foods: results,
    });
  }
  // If no query is provided, it returns all foods in the array.
  res.json({
    message: `Retrieved all foods (${results.length}).`,
    foods: results,
  });
});

app.put("/foods/:id", (req, res) => { // PUT method updates an existing food item identified by id.
  const foodId = Number(req.params.id);
  const { name, calories } = req.body; // checks that name and calories are provided in the request body.
  // If not, it responds with a 400 status code.
  if (!name || calories == null) {
    return res
      .status(400)
      .json({ message: "Cannot update: name and calories are required." });
  }
  // Searches for the food item by id.
  const idx = foods.findIndex((f) => f.id === foodId);
  // If the food item is not found, it responds with a 404 status code.
  if (idx === -1) {
    return res
      .status(404)
      .json({ message: `No food found with id ${foodId}.` });
  }
  // If the food is found, it updates the corresponding food object and responds with a 200 status code.
  foods[idx] = { id: foodId, name, calories };
  res.json({
    message: `Food with id ${foodId} updated successfully.`,
    food: foods[idx],
  });
});

app.delete("/foods/:id", (req, res) => { // DELETE method deletes a food item identified by id.
  const foodId = Number(req.params.id);
  const exists = foods.some((f) => f.id === foodId); // checks if the food item exists by searching for the id in the foods array.
  // If not found, it responds with a 404 status code.
  if (!exists) {
    return res
      .status(404)
      .json({ message: `No food found with id ${foodId}.` });
  }
  // If the food item exists, it filters it out of the array and responds with a success message.
  foods = foods.filter((f) => f.id !== foodId);
  res.json({ message: `Food with id ${foodId} deleted successfully.` });
});

app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});