import mongoose from 'mongoose';

const testCaseResultSchema = new mongoose.Schema({
  caseIndex: Number,
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: Boolean,
  isHidden: Boolean,
  executionTime: Number,
  error: String,
});

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'cpp', 'java'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
      required: true,
      index: true,
    },
    runtime: {
      type: Number, // in ms
      default: 0,
    },
    memory: {
      type: Number, // in MB
      default: 0,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    testCaseResults: [testCaseResultSchema],
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Submission', submissionSchema);
