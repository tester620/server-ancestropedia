export const getMyPayments = async (req, res) => {
  const { user } = req.user;
  try {
    const payments = await PaymentAddress.find({ userId: user._id });
    if (!payments) {
      return res.status(400).json({
        message: "Payments not found",
      });
    }
  } catch (error) {
    console.log("Error in getting my payments", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
