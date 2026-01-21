import { GoogleGenAI } from "@google/genai";
import { PortfolioMetrics, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPortfolioInsights = async (
  metrics: PortfolioMetrics,
  recentTransactions: Transaction[]
): Promise<string> => {
  try {
    const transactionHistory = recentTransactions
      .slice(0, 10)
      .map(
        (t) =>
          `- ${t.type} $${t.amountUSD} at ${t.rate} BDT/USD on ${new Date(t.date).toLocaleDateString()}`
      )
      .join("\n");

    const prompt = `
      You are a helpful financial assistant for a currency trader in Bangladesh trading USD/BDT.
      
      Analyze the following portfolio state:
      - Realized Profit: ${metrics.realizedProfit.toFixed(2)} BDT
      - Current USD Inventory: $${metrics.inventoryUSD.toFixed(2)}
      - Average Buy Cost (Break-even): ${metrics.avgBuyCost.toFixed(2)} BDT/USD
      - Capital Locked: ${metrics.lockedCapitalBDT.toFixed(2)} BDT

      Recent Transactions:
      ${transactionHistory || "No transactions yet."}

      Please provide a brief, insightful analysis of their performance and some general advice. 
      IMPORTANT: The response MUST be in Bengali (Bangla) language as requested by the user interface.
      Keep the tone professional yet encouraging.
      Focus on whether they are profitable and if their average buy cost is good considering a hypothetical market rate of around 120-125 BDT (just for context, do not Hallucinate current rates if not known, just use the break-even logic).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "দুঃখিত, বর্তমানে কোনো পরামর্শ দেওয়া সম্ভব হচ্ছে না।";
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "AI সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।";
  }
};