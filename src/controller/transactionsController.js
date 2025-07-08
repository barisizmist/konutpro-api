// Transactions Controller
// Best practice: Her bir işlemi ayrı fonksiyon olarak dışa aktar
import { sql } from '../config/db.js';

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await sql`SELECT * FROM transactions`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransactionById = async (req, res) => {
  const transactionId = req.params.id;
  try {
    const transaction = await sql`SELECT * FROM transactions WHERE id = ${transactionId}`;
    if (transaction.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction[0]);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTransaction = async (req, res) => {
  const { userId, amount, description } = req.body;
  if (!userId || !amount || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await sql`INSERT INTO transactions (userId, amount, description) VALUES (${userId}, ${amount}, ${description})`;
    res.status(201).json({ message: 'Transaction created successfully' });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.detail });
  }
};

export const updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const { userId, amount, description } = req.body;
  if (!userId || !amount || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await sql`UPDATE transactions SET userId = ${userId}, amount = ${amount}, description = ${description} WHERE id = ${transactionId}`;
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;
  try {
    const result = await sql`DELETE FROM transactions WHERE id = ${transactionId} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const summary = await sql`SELECT userId, SUM(amount) AS balance,
      SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as expense,
      SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income
      FROM transactions GROUP BY userId`;
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
