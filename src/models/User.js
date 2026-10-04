import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    college: {
      type: String,
      default: 'CSE Engineering College',
    },
    graduationYear: {
      type: Number,
      default: 2026,
    },
    phone: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      default: 21,
    },
    firebaseUid: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      default: 'email',
    },
    subscription: {
      status: {
        type: String,
        enum: ['none', 'active', 'expired'],
        default: 'none',
      },
      plan: {
        type: String,
        default: 'monthly',
      },
      amount: {
        type: Number,
        default: 1000,
      },
      startDate: {
        type: Date,
      },
      expiryDate: {
        type: Date,
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      autoRenew: {
        type: Boolean,
        default: false,
      }
    },
    solvedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      }
    ],
    attemptedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      }
    ],
    bookmarkedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      }
    ],
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastActiveDate: {
        type: Date,
      },
      activityDates: [
        {
          date: String, // YYYY-MM-DD
          count: Number,
        }
      ]
    }
  },
  {
    timestamps: true,
  }
);

// Password hash hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if subscription is actively valid
userSchema.methods.isSubscribed = function () {
  if (this.role === 'admin') return true;
  if (this.subscription?.status === 'active' && this.subscription?.expiryDate) {
    return new Date(this.subscription.expiryDate) > new Date();
  }
  return false;
};

export default mongoose.model('User', userSchema);
