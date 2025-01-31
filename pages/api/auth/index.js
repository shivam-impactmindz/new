import shopify from "@/utils/shopify";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { shop } = req.query;
    if (!shop || !shop.endsWith(".myshopify.com")) {
      return res.status(400).json({ error: "Invalid shop parameter" });
    }
    try {
      await shopify.auth.begin({
        shop,
        callbackPath: "/api/auth/callback",
        isOnline: true, // Use `true` for online sessions
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to initiate OAuth" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}