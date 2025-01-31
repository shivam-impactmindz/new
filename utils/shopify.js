// utils/shopify.js
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_API_SCOPES.split(","),
  hostName: process.env.HOST.replace(/^https?:\/\//, ""), // Remove protocol from host
  apiVersion: process.env.SHOPIFY_API_VERSION || ApiVersion.October23, // Default API version
  isEmbeddedApp: false, // Use true for embedded apps, false otherwise
});
export default shopify;