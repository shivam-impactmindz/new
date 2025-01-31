import shopify from "@/utils/shopify";
import { MongoClient } from "mongodb";
import Cookies from "cookies";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { session } = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      // Save session details to MongoDB
      await client.connect();
      const database = client.db("shopifyapp");
      const sessions = database.collection("sessions");

      const { shop, accessToken, scope } = session;
      const sessionData = {
        shop,
        accessToken,
        scope,
        installed: true, // Mark app as installed
        createdAt: new Date(),
      };

      await sessions.updateOne(
        { shop },
        { $set: sessionData },
        { upsert: true }
      );

      // Save session data to cookies
      const cookies = new Cookies(req, res);
      cookies.set("shopify-app", JSON.stringify(sessionData), {
        httpOnly: true,  // Prevent client-side access to cookie
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "none", // Allow cookies in cross-origin requests
        path: "/",  // Make the cookie available across the whole site
      });

      // Debugging - Log the cookie to check if it's being set
      console.log("Cookies Set:", cookies.get("shopify-app"));

      // Redirect to /products after successful OAuth
      res.redirect(`/products`);
    } catch (error) {
      console.error("Error during OAuth callback:", error);
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