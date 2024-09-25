// pages/api/getFungibleTokens.ts
import { NextApiRequest, NextApiResponse } from "next";

const GRAPHQL_ENDPOINT =
  "https://aptos-mainnet.nodit.io/p9s7N7Jv-P746Pi4LfRJlnzfgNBjXpyF/v1/graphql";

const query = `
  query GetFungibleAssetBalances($address: String, $offset: Int) {
    current_fungible_asset_balances(
      where: {owner_address: {_eq: $address}},
      offset: $offset,
      limit: 100,
      order_by: {amount: desc}
    ) {
      asset_type
      amount
      __typename
    }
  }
`;

function extractCoinName(assetType: string): string {
  // Try to match the last part after ::
  const match = assetType.match(/::([^:]+)$/);
  if (match) {
    return match[1];
  }

  // If no match, try to get the last part after the last /
  const parts = assetType.split("/");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }

  // If still no match, return the original string
  return assetType;
}

async function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, unknown>
) {
  const result = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
  return await result.json();
}

interface TokenBalance {
  assetType: string;
  amount: number;
  fullAssetType: string;
  percentage?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const address = req.query.address as string;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    try {
      const response = await fetchGraphQL(query, "GetFungibleAssetBalances", {
        address,
        offset,
      });

      const tokenBalances: TokenBalance[] =
        response.data.current_fungible_asset_balances.map(
          (balance: { asset_type: string; amount: string }) => ({
            assetType: extractCoinName(balance.asset_type),
            amount: parseInt(balance.amount),
            fullAssetType: balance.asset_type,
          })
        );

      const totalValue = tokenBalances.reduce(
        (sum: number, token: TokenBalance) => sum + token.amount,
        0
      );

      const tokenBalancesWithPercentage = tokenBalances.map(
        (token: TokenBalance) => ({
          ...token,
          percentage: (token.amount / totalValue) * 100,
        })
      );

      res.status(200).json(tokenBalancesWithPercentage);
    } catch (error) {
      console.error("Error fetching fungible token balances:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch fungible token balances" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
