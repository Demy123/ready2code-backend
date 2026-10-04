export const requireSubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Admins always have full access
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.isSubscribed()) {
    return next();
  }

  return res.status(402).json({
    success: false,
    message: 'Active subscription required. Please subscribe to access the complete question suite and submit code.',
    subscriptionRequired: true,
  });
};
