import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

async function verifyMongo() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const total = await Question.countDocuments();
  console.log(`Total questions in MongoDB: ${total}`);

  for (const qNum of [1, 2, 3, 50, 100, 109, 120, 150, 164, 170]) {
    const q = await Question.findOne({ order: qNum });
    if (q) {
      console.log(`\nQ${q.order} — ${q.title} (${q.topic}):`);
      console.log(`  Visible Test Cases: ${q.visibleTestCases.length}`);
      console.log(`  Hidden Test Cases: ${q.hiddenTestCases.length}`);
      console.log(`  Sample 1 Input: ${JSON.stringify(q.visibleTestCases[0]?.input)} -> Output: ${JSON.stringify(q.visibleTestCases[0]?.expectedOutput)}`);
      console.log(`  Hidden 1 Input: ${JSON.stringify(q.hiddenTestCases[0]?.input)} -> Output: ${JSON.stringify(q.hiddenTestCases[0]?.expectedOutput)}`);
    } else {
      console.error(`Missing Q${qNum}`);
    }
  }

  await mongoose.disconnect();
}

verifyMongo();
