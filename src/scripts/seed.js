import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Submission from '../models/Submission.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Database Seeding with PDF DSA Bank (170 Questions)...');

    // Load parsed PDF questions
    const jsonPath = path.join(__dirname, '../data/pdf170Questions.json');
    let pdfQuestions = [];
    if (fs.existsSync(jsonPath)) {
      pdfQuestions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }

    const existingCount = await Question.countDocuments();
    if (existingCount === 0 && pdfQuestions.length > 0) {
      console.log(`📥 Seeding ${pdfQuestions.length} exact questions from DSA Problem Bank PDF...`);
      await Question.insertMany(pdfQuestions);
      console.log(`✅ ${pdfQuestions.length} questions from PDF seeded successfully into MongoDB!`);
    } else if (pdfQuestions.length > 0) {
      console.log(`🔄 Synchronizing full question details & test cases across ${existingCount} questions in MongoDB...`);
      for (const pq of pdfQuestions) {
        await Question.findOneAndUpdate(
          { $or: [{ order: pq.order }, { slug: pq.slug }] },
          {
            $set: {
              title: pq.title,
              slug: pq.slug,
              topic: pq.topic,
              difficulty: pq.difficulty,
              description: pq.description,
              constraints: pq.constraints,
              examples: pq.examples,
              boilerplates: pq.boilerplates,
              visibleTestCases: pq.visibleTestCases,
              hiddenTestCases: pq.hiddenTestCases,
              companyTags: pq.companyTags,
              hints: pq.hints,
            },
          },
          { upsert: true, new: true }
        );
      }
      console.log(`✅ Full questions & test cases successfully updated for all 170 questions in MongoDB.`);
    }

    // Seed Admin User
    let admin = await User.findOne({ email: 'admin@placementpro.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Placement Admin',
        email: 'admin@placementpro.com',
        password: 'Admin@123',
        role: 'admin',
        college: 'Placement Faculty Board',
        graduationYear: 2024,
        subscription: {
          status: 'active',
          plan: 'admin_lifetime',
          startDate: new Date(),
          expiryDate: new Date('2030-01-01'),
        },
      });
      console.log('✅ Admin user created: admin@placementpro.com / Admin@123');
    }

    // Seed Demo Student User
    let student = await User.findOne({ email: 'student@college.edu' });
    const sampleQuestions = await Question.find().limit(5);
    const solvedIds = sampleQuestions.slice(0, 3).map((q) => q._id);

    if (!student) {
      const now = new Date();
      const expiry = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000); // 28 days left

      student = await User.create({
        name: 'Rahul Sharma',
        email: 'student@college.edu',
        password: 'Student@123',
        role: 'student',
        college: 'IIT Delhi CSE',
        graduationYear: 2026,
        subscription: {
          status: 'active',
          plan: 'monthly',
          amount: 1000,
          startDate: now,
          expiryDate: expiry,
          razorpayOrderId: 'order_seed_demo_1001',
          razorpayPaymentId: 'pay_seed_demo_1001',
          autoRenew: true,
        },
        solvedQuestions: solvedIds,
        attemptedQuestions: sampleQuestions.map((q) => q._id),
        bookmarkedQuestions: [sampleQuestions[0]?._id, sampleQuestions[3]?._id].filter(Boolean),
        streak: {
          current: 5,
          longest: 12,
          lastActiveDate: now,
          activityDates: [
            { date: '2026-09-30', count: 2 },
            { date: '2026-10-01', count: 3 },
            { date: '2026-10-02', count: 1 },
            { date: '2026-10-03', count: 4 },
            { date: '2026-10-04', count: 2 },
          ],
        },
      });

      await Transaction.create({
        user: student._id,
        amount: 1000,
        currency: 'INR',
        plan: 'monthly',
        status: 'paid',
        razorpayOrderId: 'order_seed_demo_1001',
        razorpayPaymentId: 'pay_seed_demo_1001',
        periodStart: now,
        periodEnd: expiry,
      });

      console.log('✅ Premium Student created: student@college.edu / Student@123 (Active ₹1000 Subscription)');
    }

    console.log('🎉 Seeding Complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// Run directly if invoked from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
