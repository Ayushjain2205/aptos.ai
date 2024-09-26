import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Fuel, User, Copy, Check } from "lucide-react";

type Transaction = {
  version: string;
  hash: string;
  success: boolean;
  timestamp: string;
  gas_used: string;
  sender: string;
};

function formatTimestamp(timestamp: string): string {
  // Assuming the timestamp is in microseconds
  const date = new Date(parseInt(timestamp) / 1000); // Convert to milliseconds
  return date.toLocaleString();
}

export default function AptosTransactionList({ address }: { address: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `/api/getTransactions?address=${address}&limit=5`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch transactions. Please try again later.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  if (loading)
    return (
      <div className="text-center text-[#06F7F7]">Loading transactions...</div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (transactions.length === 0)
    return (
      <div className="text-center text-[#06F7F7]">No transactions found.</div>
    );

  return (
    <div className="w-[800px] bg-[#121919] rounded-xl shadow-lg overflow-hidden p-6">
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {transactions.map((tx, index) => (
          <TransactionCard key={tx.version} transaction={tx} index={index} />
        ))}
      </div>
    </div>
  );
}

function TransactionCard({
  transaction: tx,
  index,
}: {
  transaction: Transaction;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-[#000000] rounded-lg p-4 hover:bg-[#1a1a1a] transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              tx.success ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {tx.success ? "Success" : "Failed"}
          </span>
          <span className="text-[#06F7F7] font-mono text-sm">{tx.version}</span>
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <Clock size={14} className="mr-1" />
          {formatTimestamp(tx.timestamp)}
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-gray-300">
          <User size={16} />
          <CopyableAddress address={tx.sender} />
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <Fuel size={16} />
          <span>{tx.gas_used}</span>
        </div>
      </div>
      <div className="flex justify-start items-center">
        <div className="flex items-center space-x-2 text-[#06F7F7]">
          <CopyableAddress address={tx.hash} />
        </div>
      </div>
    </motion.div>
  );
}

function CopyableAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer group"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Click to copy"}
    >
      <span className="font-mono text-sm text-gray-300 group-hover:text-[#06F7F7] transition-colors">
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </span>
      {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <Copy
          size={16}
          className="text-gray-400 group-hover:text-[#06F7F7] transition-colors"
        />
      )}
    </div>
  );
}
