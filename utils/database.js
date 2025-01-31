import mongoose from "mongoose";

const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Successfully connected to MongoDB");
};

export default connectToDatabase;


// import mongoose from "mongoose";
// const connectToDatabase = async () => {

//   await mongoose.connect("mongodb+srv://shivam:shivam@cluster0.lo7se.mongodb.net/shopifyapp");
//   console.log("successfully connected")
// };
// export default connectToDatabase;