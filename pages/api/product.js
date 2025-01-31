import connectToDatabase from "@utils/database";
import Session from "@/src/models/session";
import axios from "axios";
export default async function handler(req, res) {
  await connectToDatabase();
    if (req.method === "GET") {
      const {shop} = req.query;
      console.log(shop);
      let findshop = await Session.findOne({shop:"shivam12store.myshopify.com"});
      if(findshop){
        const shopifyApiUrl = `https://shivam12store.myshopify.com/admin/api/2025-01/products.json`;
        const response = await axios.get(shopifyApiUrl, {
          headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': findshop.accessToken, // Use access token from session
          },
      });
      
      if (response && response.data.products) {
        return res.status(200).json({
            data: response.data.products,
            isSuccess: true,
            message: 'Successfully fetched products',
        });
    } else {
        return res.status(200).json({ message: 'Data not found', isSuccess: false });
    }
      }         
     
    } else {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
  }