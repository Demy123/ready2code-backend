import Question from '../models/Question.js';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Transaction from '../models/Transaction.js';

// @desc Get comprehensive admin analytics
// @route GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeSubscribers = await User.countDocuments({
      role: 'student',
      'subscription.status': 'active',
      'subscription.expiryDate': { $gt: new Date() },
    });
    const totalQuestions = await Question.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const acceptedSubmissions = await Submission.countDocuments({ status: 'Accepted' });

    // Calculate total revenue from paid transactions
    const paidTransactions = await Transaction.find({ status: 'paid' });
    const totalRevenue = paidTransactions.reduce((acc, t) => acc + (t.amount || 1000), 0);

    // Recent submissions
    const recentSubmissions = await Submission.find()
      .populate('user', 'name email')
      .populate('question', 'title topic difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    // Topic breakdown
    const questions = await Question.find().select('topic difficulty');
    const topicDistribution = {};
    questions.forEach((q) => {
      topicDistribution[q.topic] = (topicDistribution[q.topic] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeSubscribers,
        totalQuestions,
        totalSubmissions,
        acceptedSubmissions,
        totalRevenue,
        acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
      },
      topicDistribution,
      recentSubmissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all users with filters & pagination
// @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { search, subscriptionStatus } = req.query;
    let query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }

    if (subscriptionStatus && subscriptionStatus !== 'All') {
      if (subscriptionStatus === 'active') {
        query['subscription.status'] = 'active';
        query['subscription.expiryDate'] = { $gt: new Date() };
      } else if (subscriptionStatus === 'expired') {
        query['subscription.status'] = 'active';
        query['subscription.expiryDate'] = { $lte: new Date() };
      } else if (subscriptionStatus === 'none') {
        query['subscription.status'] = 'none';
      }
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Manually grant / extend / revoke student subscription
// @route PUT /api/admin/users/:id/subscription
export const manageUserSubscription = async (req, res) => {
  try {
    const { daysToAdd, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    let expiryDate = new Date();

    if (status === 'revoked' || status === 'none') {
      user.subscription.status = 'none';
      user.subscription.expiryDate = null;
    } else {
      const days = parseInt(daysToAdd) || 30;
      if (user.subscription?.status === 'active' && user.subscription.expiryDate > now) {
        expiryDate = new Date(new Date(user.subscription.expiryDate).getTime() + days * 24 * 60 * 60 * 1000);
      } else {
        expiryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      }

      user.subscription = {
        status: 'active',
        plan: 'admin_granted',
        amount: 1000,
        startDate: now,
        expiryDate,
        razorpayOrderId: `admin_grant_${Date.now()}`,
        razorpayPaymentId: `admin_${Date.now()}`,
        autoRenew: false,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'User subscription updated successfully',
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin get all questions including hidden test cases
// @route GET /api/admin/questions
export const getAdminQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a new question
// @route POST /api/admin/questions
export const createQuestion = async (req, res) => {
  try {
    const {
      title,
      topic,
      difficulty,
      description,
      constraints,
      examples,
      boilerplates,
      visibleTestCases,
      hiddenTestCases,
      hints,
      companyTags,
      isPremium,
    } = req.body;

    if (!title || !topic || !description) {
      return res.status(400).json({ success: false, message: 'Title, Topic and Description are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const count = await Question.countDocuments();

    const question = await Question.create({
      title,
      slug,
      topic,
      difficulty: difficulty || 'Medium',
      order: count + 1,
      isPremium: isPremium !== undefined ? isPremium : true,
      description,
      constraints: constraints || [],
      examples: examples || [],
      boilerplates: boilerplates || {},
      visibleTestCases: visibleTestCases || [],
      hiddenTestCases: hiddenTestCases || [],
      hints: hints || [],
      companyTags: companyTags || [],
    });

    res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update an existing question
// @route PUT /api/admin/questions/:id
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete a question
// @route DELETE /api/admin/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({
      success: true,
      message: 'Question removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Re-sync all 170 questions from PDF dataset
// @route POST /api/admin/resync-pdf
export const resyncFromPdf = async (req, res) => {
  try {
    const { seedDatabase } = await import('../scripts/seed.js');
    await seedDatabase();
    const count = await Question.countDocuments();
    res.json({
      success: true,
      message: `Successfully synchronized ${count} questions from DSA Problem Bank PDF!`,
      count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
