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
  const user = users.find((P) => P.id === parseInt(req.params.id));
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

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
// update user
const updateUser = (req, res) => {
  try {
    const users = readUsers();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email already exists (excluding current user)
    const existingUser = users.find(
      (u) => u.email === email && u.id !== userId
    );
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

    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user
const deleteUser = (req, res) => {
  try {
    const users = readUsers();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove user from array
    users.splice(userIndex, 1);

    // Write to file
    writeUsers(users);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
