import mongoose from 'mongoose';
import Question from '../models/Question.js';
import User from '../models/User.js';

// @desc Get all questions with filters, topic counts and user solved status
// @route GET /api/questions
export const getAllQuestions = async (req, res) => {
  try {
    const { topic, difficulty, search, status } = req.query;

    let query = {};
    if (topic && topic !== 'All') {
      query.topic = topic;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyTags: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    // Exclude hiddenTestCases for normal listing
    const questions = await Question.find(query)
      .select('-hiddenTestCases')
      .sort({ order: 1 });

    // Grouping by topic for stats
    const allQuestions = await Question.find({}).select('topic difficulty _id order');
    const topicStats = {};
    let totalEasy = 0, totalMedium = 0, totalHard = 0;

    allQuestions.forEach((q) => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, easy: 0, medium: 0, hard: 0, questions: [] };
      }
      topicStats[q.topic].total += 1;
      if (q.difficulty === 'Easy') { topicStats[q.topic].easy += 1; totalEasy++; }
      if (q.difficulty === 'Medium') { topicStats[q.topic].medium += 1; totalMedium++; }
      if (q.difficulty === 'Hard') { topicStats[q.topic].hard += 1; totalHard++; }
    });

    res.json({
      success: true,
      count: questions.length,
      totalQuestions: allQuestions.length,
      difficultyBreakdown: { easy: totalEasy, medium: totalMedium, hard: totalHard },
      topicStats,
      questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single question by slug or ID
// @route GET /api/questions/:slug
export const getQuestionBySlug = async (req, res) => {
  try {
    const param = req.params.slug;
    let question = await Question.findOne({ slug: param });
    
    if (!question && mongoose.Types.ObjectId.isValid(param)) {
      question = await Question.findById(param);
    }
    
    if (!question) {
      question = await Question.findOne({ slug: { $regex: new RegExp(`^${param}$`, 'i') } });
    }

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Exclude hidden test cases if not admin
    const isUserAdmin = req.user && req.user.role === 'admin';
    const responseData = question.toObject();
    if (!isUserAdmin) {
      delete responseData.hiddenTestCases;
    }

    res.json({
      success: true,
      question: responseData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle star/bookmark on a question
// @route POST /api/questions/:id/bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const questionId = req.params.id;

    const isBookmarked = user.bookmarkedQuestions.some(
      (id) => id.toString() === questionId.toString()
    );

    if (isBookmarked) {
      user.bookmarkedQuestions = user.bookmarkedQuestions.filter(
        (id) => id.toString() !== questionId.toString()
      );
    } else {
      user.bookmarkedQuestions.push(questionId);
    }

    await user.save();

    res.json({
      success: true,
      bookmarked: !isBookmarked,
      bookmarkedQuestions: user.bookmarkedQuestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
