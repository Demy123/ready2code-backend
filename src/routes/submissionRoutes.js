import express from 'express';
import { runCode, submitCode, getQuestionSubmissions, getUserRecentSubmissions } from '../controllers/submissionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/run', runCode);
router.post('/submit', protect, submitCode);
router.get('/question/:questionId', protect, getQuestionSubmissions);
router.get('/user/recent', protect, getUserRecentSubmissions);

export default router;
