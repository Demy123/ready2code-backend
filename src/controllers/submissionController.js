import Question from '../models/Question.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { runCodeAgainstTestCases } from '../services/codeRunner.js';

// @desc Run code against visible sample test cases
// @route POST /api/submissions/run
export const runCode = async (req, res) => {
  try {
    const { questionId, code, language, customInput } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    let testCasesToRun = [];

    if (customInput !== undefined && customInput !== null && customInput.trim() !== '') {
      testCasesToRun = [
        {
          input: customInput,
          expectedOutput: '', // will just output whatever was produced
          isHidden: false,
        }
      ];
    } else {
      testCasesToRun = question.visibleTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: false,
      }));
    }

    const result = await runCodeAgainstTestCases(code, language, testCasesToRun, false);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Submit code against visible + hidden test cases
// @route POST /api/submissions/submit
export const submitCode = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;
    const userId = req.user._id;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Check if question is premium and user is not subscribed
    if (question.isPremium && !req.user.isSubscribed() && req.user.role !== 'admin') {
      return res.status(402).json({
        success: false,
        message: 'This problem requires an active PlacementPro Subscription (₹1,000/month).',
        subscriptionRequired: true,
      });
    }

    // Build combined test cases
    const allTestCases = [
      ...question.visibleTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: false,
      })),
      ...question.hiddenTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: true,
      })),
    ];

    const result = await runCodeAgainstTestCases(code, language, allTestCases, true);

    // Save submission to DB
    const submission = await Submission.create({
      user: userId,
      question: questionId,
      code,
      language,
      status: result.status,
      runtime: result.runtime,
      memory: result.memory,
      passedTestCases: result.passedTestCases,
      totalTestCases: result.totalTestCases,
      testCaseResults: result.testCaseResults,
      errorMessage: result.errorMessage,
    });

    // Update question statistics
    question.totalSubmissions += 1;
    if (result.status === 'Accepted') {
      question.acceptedSubmissions += 1;
    }
    await question.save();

    // Update user stats, solved array and streak
    const user = await User.findById(userId);

    if (!user.attemptedQuestions.some(id => id.toString() === questionId.toString())) {
      user.attemptedQuestions.push(questionId);
    }

    // Strictly mark as Solved only when 100% of test cases (visible + hidden) pass
    const is100PercentPassed = result.status === 'Accepted' && 
                               result.totalTestCases > 0 && 
                               result.passedTestCases === result.totalTestCases;

    if (is100PercentPassed) {
      if (!user.solvedQuestions.some(id => id.toString() === questionId.toString())) {
        user.solvedQuestions.push(questionId);
      }

      // Update streak
      const todayStr = new Date().toISOString().split('T')[0];
      const streak = user.streak || { current: 0, longest: 0, activityDates: [] };

      const existingActivity = streak.activityDates.find(a => a.date === todayStr);
      if (existingActivity) {
        existingActivity.count += 1;
      } else {
        streak.activityDates.push({ date: todayStr, count: 1 });

        // Check if last active was yesterday
        if (streak.lastActiveDate) {
          const lastDate = new Date(streak.lastActiveDate);
          const diffDays = Math.floor((new Date(todayStr) - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak.current += 1;
          } else if (diffDays > 1) {
            streak.current = 1;
          }
        } else {
          streak.current = 1;
        }

        streak.lastActiveDate = new Date();
        streak.longest = Math.max(streak.longest, streak.current);
      }

      user.streak = streak;
    }

    await user.save();

    res.status(201).json({
      success: true,
      submission,
      userSolvedCount: user.solvedQuestions.length,
      isAccepted: result.status === 'Accepted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get submission history for a specific question
// @route GET /api/submissions/question/:questionId
export const getQuestionSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      question: req.params.questionId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user's all recent submissions
// @route GET /api/submissions/user/recent
export const getUserRecentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('question', 'title topic difficulty slug')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
