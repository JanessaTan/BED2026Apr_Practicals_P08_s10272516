const regModel = require("../models/userRegistration");
const loginModel = require("../models/userLogin");

async function registerUser(req, res) {
    try {
    const register = await regModel.registerUser();
    res.json(register);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
}

async function login(req, res) {
    try {
    const login = await loginModel.login();
    res.json(login);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error logging in user" });
  }
}

module.exports = {
  registerUser,
  login
};