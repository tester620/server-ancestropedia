import Notification from "../models/notification.model.js";

export const tokenAllotmentNotification = async (amount, user) => {
  const newNotification = new Notification({
    about: `You have been successfully allotted tokens: ${amount}`,
    redirectUrl: `${process.env.FRONTEND_URL}/tokens`,
    toUser: user._id,
  });
  await newNotification.save();
  return newNotification;
};

export const tokenRemovalNotification = async (amount, user) => {
  const newNotification = new Notification({
    about: `Your tokens have been removed by the admin. Tokens removed: ${amount}`,
    redirectUrl: `${process.env.FRONTEND_URL}/tokens`,
    toUser: user._id,
  });
  await newNotification.save();
  return newNotification;
};

export const tokenRejectionNotification = async (amount, user) => {
  const newNotification = new Notification({
    about: `Your request for ${amount} tokens has been rejected.`,
    redirectUrl: `${process.env.FRONTEND_URL}/tokens`,
    toUser: user._id,
  });
  await newNotification.save();
  return newNotification;
};
