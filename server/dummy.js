const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.setHeader("Retry-After", retryAfter);
    res.status(429).json({
      message: `Too many attempts. Try again in ${retryAfter / 60} minutes.`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
