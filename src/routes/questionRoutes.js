import express from 'express';
import { getAllQuestions, getQuestionBySlug, toggleBookmark } from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public / auth-optional listing
router.get('/', getAllQuestions);
router.get('/:slug', getQuestionBySlug);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
