import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: "You're making requests too quickly. Please wait a minute and try again.",
  },
});
