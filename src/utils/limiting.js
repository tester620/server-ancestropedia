import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    message: "You're making requests too quickly. Please wait a minute and try again.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    message: "You're making requests too quickly. Please wait for some time and try again.",
  },
});
