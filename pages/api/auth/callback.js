import shopify from "@/utils/shopify";
import connectToDatabase from "@/utils/database";
import Cookies from "cookies";
import { Shopify } from "@shopify/shopify-api";
import Session from "@/src/models/session";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { hmac, ...params } = req.query;

      // ✅ Validate HMAC Signature for security
      if (!Shopify.Utils.validateHmac(hmac, params, process.env.SHOPIFY_API_SECRET)) {
        throw new Error("Invalid HMAC signature detected.");
      }

      // ✅ Shopify OAuth Callback
      const { session } = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      console.log("🔹 Shopify Session Data:", session);

      if (!session?.shop || !session?.accessToken) {
        throw new Error("Session missing required fields (shop, accessToken)");
      }

      // ✅ Connect to MongoDB
      await connectToDatabase();

      // ✅ Store session in MongoDB (upsert)
      const { shop, accessToken, scope } = session;
      await Session.findOneAndUpdate(
        { shop },  // Use `Session` model here
        { shop, accessToken, scope, installed: true, createdAt: new Date() },
        { upsert: true }
      );

      // ✅ Save session data in secure HTTP-only cookies
      const cookies = new Cookies(req, res);
      cookies.set("shopify-app", JSON.stringify({ shop, accessToken, installed: true }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
      });

      console.log("✅ Session saved in MongoDB and cookies.");

      // ✅ Redirect to /products after successful authentication
      res.redirect(`/products`);
    } catch (error) {
      console.error("❌ OAuth Callback Error:", error);
      res.status(500).send("Error during authentication");
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