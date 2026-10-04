import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  manageUserSubscription,
  getAdminQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  resyncFromPdf,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Admin protection applied to all routes in this router
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/subscription', manageUserSubscription);
router.get('/questions', getAdminQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/resync-pdf', resyncFromPdf);

export default router;
