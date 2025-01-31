import mongoose from "mongoose";
const connectToDatabase = async () => {

  await mongoose.connect("mongodb+srv://shivam:shivam@cluster0.lo7se.mongodb.net/shopifyapp");
  console.log("successfully connected")
};
export default connectToDatabase;