import { NextApiRequest, NextApiResponse } from "next";

const GRAPHQL_ENDPOINT =
  "https://aptos-mainnet.nodit.io/p9s7N7Jv-P746Pi4LfRJlnzfgNBjXpyF/v1/graphql";

const query = `
  query GetAccountNfts($address: String) {
    current_token_ownerships_v2(
      where: {owner_address: {_eq: $address}, amount: {_gt: "0"}}
    ) {
      current_token_data {
        collection_id
        largest_property_version_v1
        current_collection {
          collection_id
          collection_name
          description
          creator_address
          uri
        }
        description
        token_name
        token_data_id
        token_standard
        token_uri
      }
      owner_address
      amount
    }
  }
`;

const placeholderSVG = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="320" viewBox="0 0 400 320">
    <rect width="400" height="320" fill="#121919"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#06F7F7" text-anchor="middle" dy=".3em">NFT Image Unavailable</text>
  </svg>
`)}`;

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

async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error(`Invalid JSON from ${url}: ${text.substring(0, 100)}...`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching metadata from ${url}:`, error);
    return null;
  }
}

interface Ownership {
  current_token_data: {
    token_data_id: string;
    token_name: string;
    description: string;
    token_uri: string;
    current_collection: {
      collection_name: string;
    };
  };
  amount: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const address = req.query.address as string;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    try {
      const response = await fetchGraphQL(query, "GetAccountNfts", { address });

      const nftPromises = response.data.current_token_ownerships_v2.map(
        async (ownership: Ownership) => {
          const metadata = await fetchMetadata(
            ownership.current_token_data.token_uri
          );
          return {
            id: ownership.current_token_data.token_data_id,
            name: metadata?.name || ownership.current_token_data.token_name,
            description:
              metadata?.description || ownership.current_token_data.description,
            image: metadata?.image || placeholderSVG, // Use inline SVG placeholder
            collection:
              ownership.current_token_data.current_collection.collection_name,
            amount: parseInt(ownership.amount),
          };
        }
      );

      const nfts = await Promise.all(nftPromises);

      res.status(200).json(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
