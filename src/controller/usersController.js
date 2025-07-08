// Users Controller
import { sql } from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`;
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await sql`SELECT * FROM users WHERE id = ${userId} ORDER BY created_at DESC`;
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, birthdate } = req.body;
  if (!name || !email || !birthdate) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await sql`INSERT INTO users (name, email, birthdate) VALUES (${name}, ${email}, ${birthdate})`;
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.detail });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, birthdate } = req.body;
  if (!name || !email || !birthdate) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await sql`UPDATE users SET name = ${name}, email = ${email}, birthdate = ${birthdate} WHERE id = ${userId}`;
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    if (isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const result = await sql`DELETE FROM users WHERE id = ${userId} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
