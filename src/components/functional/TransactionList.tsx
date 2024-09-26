import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Database, DollarSign, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Transaction = {
  version: string;
  hash: string;
  success: boolean;
  timestamp: string;
  gas_used: string;
  sender: string;
};

const typeColors = {
  User: "bg-blue-500",
  Contract: "bg-purple-500",
  System: "bg-green-500",
};

function formatTimestamp(timestamp: string): string {
  return new Date(parseInt(timestamp) / 1000).toLocaleString();
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function AptosTransactionList({ address }: { address: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `/api/getTransactions?address=${address}&limit=10`
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
    <Card className="w-full max-w-[800px] bg-[#121919] shadow-lg">
      <CardHeader></CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border border-[#2a2a2a] p-4">
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <TransactionCard
                key={tx.version}
                transaction={tx}
                index={index}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
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
      className="bg-[#000000] rounded-lg p-3 hover:bg-[#1a1a1a] transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${typeColors["User"]}`}
          >
            User
          </span>
          <span className="text-[#06F7F7] font-mono text-xs">{tx.version}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center text-gray-400 text-xs">
                <Clock size={12} className="mr-1" />
                {formatTimestamp(tx.timestamp)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Transaction Timestamp</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center justify-between mb-2 text-xs">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-1 text-gray-300">
                <User size={12} />
                <span>{truncateAddress(tx.sender)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sender Address</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ArrowRight size={12} className="text-[#06F7F7]" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-1 text-gray-300">
                <User size={12} />
                <span>{truncateAddress(tx.sender)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Recipient Address (placeholder)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex justify-between items-center text-xs">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-1 text-[#06F7F7]">
                <Database size={12} />
                <span>Transaction::execute</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Transaction Function (placeholder)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-1 text-green-400">
                <DollarSign size={12} />
                <span>
                  {(parseInt(tx.gas_used) / 100000000).toFixed(8)} APT
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Gas Used (in APT)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
