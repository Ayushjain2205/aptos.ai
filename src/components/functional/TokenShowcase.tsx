import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import "react-circular-progressbar/dist/styles.css";

type TokenBalance = {
  assetType: string;
  amount: number;
  percentage: number | null;
  fullAssetType: string;
};

function formatAmount(amount: number): string {
  if (amount >= 1e12) return (amount / 1e12).toFixed(2) + "T";
  if (amount >= 1e9) return (amount / 1e9).toFixed(2) + "B";
  if (amount >= 1e6) return (amount / 1e6).toFixed(2) + "M";
  if (amount >= 1e3) return (amount / 1e3).toFixed(2) + "K";
  return amount.toString();
}

function formatPercentage(percentage: number | null | undefined): string {
  if (percentage == null) return "0.0%";
  return percentage.toFixed(1) + "%";
}

export default function AptosTokenBalances() {
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenBalances = async () => {
      try {
        const response = await fetch(
          "/api/getFungibleTokens?address=0x8824ebb6e0d60656f6d4d5bbc408805d9ca6b984aad78b16f42b1dae545d6762"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch token balances");
        }
        const data = await response.json();
        setTokenBalances(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch token balances. Please try again later.");
        setLoading(false);
      }
    };

    fetchTokenBalances();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-[#06F7F7]">
        Loading token balances...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (tokenBalances.length === 0) {
    return (
      <div className="text-center text-[#06F7F7]">
        No token balances found for this address.
      </div>
    );
  }

  return (
    <div className="w-[800px] h-[400px] bg-[#121919] rounded-xl shadow-lg overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#06F7F7]">
        Your Aptos Tokens
      </h2>
      <div className="grid grid-cols-4 gap-6 overflow-y-auto h-[calc(100%-80px)]">
        {tokenBalances.map((token, index) => (
          <div
            key={index}
            className="bg-[#000000] rounded-lg p-4 flex flex-col items-center justify-between h-[160px]"
          >
            <div className="w-16 h-16 mb-2">
              <AnimatedProgressProvider
                valueStart={0}
                valueEnd={token.percentage ?? 0}
                duration={1}
                easingFunction={easeQuadInOut}
              >
                {(value: number) => {
                  const roundedValue = Math.round(value);
                  return (
                    <CircularProgressbar
                      value={value}
                      text={`${roundedValue}%`}
                      styles={buildStyles({
                        textColor: "#06F7F7",
                        pathColor: "#06F7F7",
                        trailColor: "#121919",
                        textSize: "26px",
                        pathTransitionDuration: 0.5,
                      })}
                    />
                  );
                }}
              </AnimatedProgressProvider>
            </div>
            <h3
              className="text-[#06F7F7] font-semibold text-sm mb-1 text-center truncate w-full"
              title={token.fullAssetType}
            >
              {token.assetType}
            </h3>
            <p className="text-gray-400 text-xs">
              {formatAmount(token.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
