import express from 'express';
import { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, getTransactionSummary } from '../controller/transactionsController.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/summary/:id', getTransactionSummary);

export default router;
