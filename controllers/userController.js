import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to data file
const filePath = path.join(__dirname, "../data/users.json");

// Helper: Read users from file
function readUsers() {
  const data = readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Helper: Write users to file
function writeUsers(users) {
  writeFileSync(filePath, JSON.stringify(users, null, 2));
}

const getAllUsers = (req, res) => {
  const users = readUsers();
  res.json(users);
};

const getUserById = (req, res) => {
  const users = readUsers();
  // The matching user (if found) is stored in the variable user
  const user = users.find((P) => P.id === parseInt(req.params.id));
  // If found → returns the user data ,If not found → returns a 404 error message
  if (!user) return res.status(404).json({ error: "user is not found" });
  res.json(user);
};
const createUser = (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const users = readUsers();

    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name,
      email,
    };

    // Add to users array
    users.push(newUser);

    // Write to file
    writeUsers(users);
    // Sends a 201 Created HTTP response & Returns the newly created user as JSON to the client
    res.status(201).json(newUser);
    // Sends a 500 Internal Server Error response with an error message
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
// update user
const updateUser = (req, res) => {
  try {
    // Read all users from file
    const users = readUsers();
    // Get the id from the URL
    const userId = parseInt(req.params.id);
    // Find the user with that ID
    const userIndex = users.findIndex((u) => u.id === userId);
    // If no user with the given ID exists ,it returns an error
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    //  Extracts name and email from the request body.
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email already exists (excluding current user)
    const existingUser = users.find(
      (u) => u.email === email && u.id !== userId
    );
    // If the email is already used by another user, it returns an error
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
    };

    // Write to file
    writeUsers(users);
    // Updates the user’s details
    res.json(users[userIndex]);
    // Handle any unexpected errors safely
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user
const deleteUser = (req, res) => {
  try {
    // Read users from storage
    const users = readUsers();
    // Get user ID from URL.
    const userId = parseInt(req.params.id);
    // Find the user in the list.
    const userIndex = users.findIndex((u) => u.id === userId);
    // If not found → respond with 404
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // If found → remove them from the array
    users.splice(userIndex, 1);

    // Write to file
    writeUsers(users);
    // Send success response
    res.json({ message: "User deleted successfully" });
    // Handle any unexpected errors safely
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
