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
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findOne({ _id: id });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete user
const deleteUser = async (req, res) => {
  try {
    const users = readUsers();
    const id = req.params.id;
    const userExist = await users.findById({ id });
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    await users.findByIdAndUpdate(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
