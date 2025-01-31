import shopify from "@/utils/shopify";
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { session } = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      // Save session details to MongoDB or another storage
      await client.connect();
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

      await sessions.updateOne(
        { shop },
        { $set: sessionData },
        { upsert: true }
      );

      // ✅ Updated redirect URL
      res.redirect(`https://new-next-shop.vercel.app/about?host=${req.query.host}&shop=${shop}`);

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