// applicationsRouter.js
import express from 'express';
import { createApplication, getAllApplications, updateApplication } from '../controller/applicationsController.js';
const router = express.Router();

router.get('/', getAllApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication); // Assuming you want to use the same handler for updates

export default router;
