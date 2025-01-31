import shopify from "@/utils/shopify";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is set in your .env file
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("🔹 Query Parameters:", req.query);

      const { hmac, ...params } = req.query;

      // ✅ Validate HMAC Signature for security
      if (!Shopify.Utils.validateHmac(hmac, params, process.env.SHOPIFY_API_SECRET)) {
        throw new Error("Invalid HMAC signature detected.");
      }

      console.log("🔹 HMAC validation successful.");

      // ✅ Shopify OAuth Callback
      const { session } = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      console.log("🔹 Shopify Session Data:", session);

      if (!session?.shop || !session?.accessToken) {
        throw new Error("Session missing required fields (shop, accessToken)");
      }

      // ✅ Save session details to MongoDB
      await client.connect();
      console.log("🔹 Connected to MongoDB.");

      const database = client.db("shopifyapp");
      const sessions = database.collection("sessions");

      const { shop, accessToken, scope, isOnline, expires } = session;

      const sessionData = {
        shop,
        accessToken,
        scope,
        isOnline,
        expires,
        createdAt: new Date(),
      };

      // Upsert session data
      await sessions.updateOne(
        { shop },
        { $set: sessionData },
        { upsert: true }
      );

      console.log("✅ Session saved in MongoDB.");

      // ✅ Redirect to the /products page
      res.redirect(`/products?shop=${shop}`);
    } catch (error) {
      console.error("❌ Error during OAuth callback:", error);
      res.status(500).send("Error during authentication");
    } finally {
      await client.close();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).send("Method Not Allowed");
  }
}
















// import shopify from "@/utils/shopify";
// import { MongoClient } from "mongodb";

// const uri = process.env.DATABASE_URL;
// const client = new MongoClient(uri);

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     try {
//       const { session } = await shopify.auth.callback({
//         rawRequest: req,
//         rawResponse: res,
//       });



//       // Save session details to MongoDB or another storage
//       await client.connect();
//       const database = client.db("shopifyapp");
//       const sessions = database.collection("sessions");

//       const { shop, accessToken, scope, isOnline, expires } = session;
         
//       const sessionData = {
//         shop,
//         accessToken,
//         scope,
//         isOnline,
//         expires,
//         createdAt: new Date(),
//       };

//       await sessions.updateOne(
//         { shop },
//         { $set: sessionData },
//         { upsert: true }
//       );

  

    
//       res.redirect(`https://next-shopapp-non-embedded.vercel.app/products?host=${req.query.host}&shop=${shop}`);
//     } catch (error) {
//       console.error("Error during OAuth callback:", error);
//       res.status(500).send("Error during authentication");
//     } finally {
//       await client.close();
//     }
//   } else {
//     res.setHeader("Allow", ["GET"]);
//     res.status(405).send("Method Not Allowed");
//   }
// }