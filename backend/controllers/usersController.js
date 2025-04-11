// usersController.js contains all controller functions necessary for CRUD for all users.
// - loadUsers: A helper function to load all users from the users.json file and returns an array of users.
// - getAllUsers: Fetches and returns all users from the database (users.json).
// - getUserById: Fetches a specific user by its ID from the database (users.json).
// - addUser: Adds a new user to the database (users.json) and returns the newly added user.
// - updateUser: Updates an existing user in the database (users.json) based on the provided ID and new data.
// - deleteUser: Deletes a user from the database (users.json) based on the provided ID.


const fs = require("fs");
const path = require("path");

// Path to users.json
const usersDatabase = path.join(__dirname, "../database/users.json");

// Function to load users
const loadUsers = () => {
    try {
        // Read the file and parse JSON data
        const rawData = fs.readFileSync(usersDatabase, "utf-8");
        const usersData = JSON.parse(rawData);

        if (!usersData.users) {
            throw new Error("Users data is missing the 'users' key");
        }

        return usersData.users;
    } catch (error) {
        console.error("Error loading users data:", error);
        throw new Error("Unable to load users data");
    }
};

// Function to return all users
const getAllUsers = (req, res) => {
    try {
        res.json(loadUsers());
    } catch (error) {
        console.error("Error loading users:", error);
        res.status(500).json({ message: "There was an error loading the users." });
    }
};

// Function to return user by ID
const getUserById = (req, res) => {
    const users = loadUsers();
    const userId = parseInt(req.params.id);

    // Search users array by user ID
    const user = users.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// Function to add a new user
const addUser = (req, res) => {
    const { name, username, password, administrator } = req.body;

    // Check for missing fields
    if (!name || !username || !password) return res.status(400).json({ message: "Missing required fields (name, username, password)" });

    try {
        // Read users data from users.json
        const data = fs.readFileSync(usersDatabase, "utf-8");
        const usersData = JSON.parse(data);

        // Ensure the users key exists in the data and is an array
        if (!Array.isArray(usersData.users)) {
            usersData.users = [];
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            active_books_checked_out: null,
            borrowing_history: null,
            wish_list: null,
            membership_dues: null,
            fees: null,
            username,
            password,
            administrator: Boolean(administrator) 
        };

        // Add the new user to the users array
        usersData.users.push(newUser);

        // Write new user into users database
        fs.writeFileSync(usersDatabase, JSON.stringify(usersData, null, 2), "utf-8");
        console.log("User added successfully:", newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "There was an error adding the user." });
    }
};

// Function to update user
const updateUser = (req, res) => {
    const { id, name, username, password, active_books_checked_out, borrowing_history, wish_list, membership_dues, fees, administrator } = req.body;

    // Load users data
    const users = loadUsers();

    // Find the index of the user to update
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    const oldUser = users[userIndex];

    // Create the updated user object
    const updatedUser = {
        ...oldUser,
        name: name ?? oldUser.name,
        username: username ?? oldUser.username,
        password: password ?? oldUser.password,
        administrator: administrator ?? oldUser.administrator,
        active_books_checked_out: active_books_checked_out ?? null,
        borrowing_history: borrowing_history ?? null,
        wish_list: wish_list ?? null,
        membership_dues: membership_dues ?? null,
        fees: fees ?? null
    };

    // Update the user in the users array
    users[userIndex] = updatedUser;

    // Write the updated users array back to the users database
    try {
        fs.writeFileSync(usersDatabase, JSON.stringify({ users }, null, 2), "utf-8");
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "There was an error updating the user." });
    }
};


// Function to delete a user
const deleteUser = (req, res) => {
    const users = loadUsers();
    const userId = parseInt(req.params.id);

    // Find index of the user to delete
    const userIndex = users.findIndex(user => user.id === userId);

    // Check if the user exists
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    const userToDelete = users.splice(userIndex, 1)[0]; // Delete user

    // Write the updated users array back to the users database
    try {
        const updatedUsersData = { users };
        fs.writeFileSync(usersDatabase, JSON.stringify(updatedUsersData, null, 2), "utf-8");
        res.status(200).json({ message: "User deleted", deletedUser: userToDelete });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "There was an error deleting the user." });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
};
