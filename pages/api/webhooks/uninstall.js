// import { MongoClient } from "mongodb";
// import Cookies from "cookies";

// const uri = process.env.MONGO_URI;
// const client = new MongoClient(uri);

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { shop_domain: shop } = req.body;

//       await client.connect();
//       const database = client.db("shopifyapp");
//       const sessions = database.collection("sessions");

//       // Update uninstall flag instead of deleting the session
//       await sessions.updateOne(
//         { shop },
//         { $set: { installed: false } }
//       );

//       // Clear cookies
//       const cookies = new Cookies(req, res);
//       cookies.set("shopify-app", "", { expires: new Date(0) });

//       res.status(200).json({ success: true });
//     } catch (error) {
//       console.error("Error handling uninstallation:", error);
//       res.status(500).json({ error: "Failed to handle uninstallation" });
//     } finally {
//       await client.close();
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// }
