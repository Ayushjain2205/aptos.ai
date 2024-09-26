import { NextApiRequest, NextApiResponse } from "next";

const API_ENDPOINT = "https://indexer.mainnet.aptoslabs.com/v1/accounts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const address = req.query.address as string;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    try {
      const response = await fetch(
        `${API_ENDPOINT}/${address}/transactions?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();

      const transactions = data
        .filter((tx: any) => tx.type === "user_transaction")
        .map((tx: any) => ({
          version: tx.version,
          hash: tx.hash,
          success: tx.success,
          timestamp: tx.timestamp,
          gas_used: tx.gas_used,
          sender: tx.sender,
        }));

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching account transactions:", error);
      res.status(500).json({ error: "Failed to fetch account transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
