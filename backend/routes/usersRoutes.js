// usersRoutes.js defines routes for managing users.
// API is accessed through http://localhost:3000/users/
//
// - GET /: Fetch all user
// - GET /:id: Fetch a single user by its ID
// - POST /: Add a new user to the system
// - PATCH /:id: Update the details of a user by its ID
// - DELETE /:id: Delete a user by its ID
//
// The controller functions are located in /controllers/usersController.js .

const { Router } = require("express");
const usersRouter = Router();
const usersController = require("../controllers/usersController");

// Route to get all users
usersRouter.get("/", usersController.getAllUsers);

// Route to get single user by ID
usersRouter.get("/:id", usersController.getUserById);

// Route to add new user
usersRouter.post("/", usersController.addUser);

// Route to update user
usersRouter.patch("/:id", usersController.updateUser);

// Route to delete user
usersRouter.delete("/:id", usersController.deleteUser);

module.exports = usersRouter;