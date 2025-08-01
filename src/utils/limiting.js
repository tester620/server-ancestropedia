import {rateLimit} from "express-rate-limit";

export const limiter = rateLimit({
  windowMs:  60 * 1000,
  max: 2,
  message: "Too many requests created from this IP, try again in an minute."
});