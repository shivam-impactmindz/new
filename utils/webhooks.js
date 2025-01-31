// utils/webhooks.js
import shopify from "@/utils/shopify";

export const registerWebhook = async (shop, accessToken) => {
  const webhookTopic = "app/uninstalled"; // Correct event name
  const webhookAddress = `${process.env.HOST}/api/webhooks/uninstall`;

  try {
    const response = await shopify.api.rest.Webhook.create({
      session: {
        shop,
        accessToken,
      },
      topic: webhookTopic,
      address: webhookAddress,
      format: "json",
    });
    console.log("Webhook registered:", response);
  } catch (error) {
    console.error("Failed to register webhook:", error);
  }
};