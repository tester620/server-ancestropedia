import DnaModel from "../models/dna-order.model.js";
import TreeArtModel from "../models/treeart.model.js";

export const placeDnaOrder = async (req, res) => {
  const user = req.user;
  const { addressDetails } = req.body;
  if (!validator.isPostalCode)
    try {
    } catch (error) {
      console.log("Error in placing the order", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
};

// export const placeTreeOrder = async(req,res)=>{
//   const {data} = req.body;
//   try {
//     if(!data){
//       return res.status(400).json({
//         message:"Data is required"
//       })
//     }
//     const newOrder = new TreeArtModel.
//   } catch (error) {
    
//   }
// }

export const getMyDNAOrders = async (req, res) => {
  const user = req.user;
  try {
    const orders = await DnaModel.find({ userId: user._id });
    if (!orders || !orders.length) {
      return res.status(404).json({
        message: "No orders found",
      });
    }
  } catch (error) {
    console.log("Error in fetching my orders", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyTreeOrders = async (req, res) => {
  try {
    const orders = await TreeArtModel.find({ userId: req.user._id });
    if (!orders ||!orders.length) {
      return res.status(404).json({
        message: "Orders not found",
      });
    }
    return res.status(200).json({
      message: "Orders fetched succesfully",
      data: orders,
    });
  } catch (error) {
    console.log("Error in fetching tree Orders", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
