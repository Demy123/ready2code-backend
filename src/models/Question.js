import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' },
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      index: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    isPremium: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
    constraints: [
      {
        type: String,
      }
    ],
    examples: [exampleSchema],
    boilerplates: {
      javascript: {
        type: String,
        default: 'function solve(input) {\n  // Write your code here\n}',
      },
      python: {
        type: String,
        default: 'def solve(input_data):\n    # Write your code here\n    pass',
      },
      cpp: {
        type: String,
        default: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
      },
      java: {
        type: String,
        default: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
      },
    },
    visibleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
    hints: [
      {
        type: String,
      }
    ],
    companyTags: [
      {
        type: String,
      }
    ],
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    acceptedSubmissions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for acceptance rate
questionSchema.virtual('acceptanceRate').get(function () {
  if (this.totalSubmissions === 0) return 65.0; // default initial baseline
  return Math.round((this.acceptedSubmissions / this.totalSubmissions) * 1000) / 10;
});

questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Question', questionSchema);
