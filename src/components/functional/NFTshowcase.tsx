"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type NFT = {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  amount: number;
};

const dummyNFTs: NFT[] = [
  {
    id: "1",
    name: "Aptos Adventurer #42",
    description: "A brave explorer venturing into the Aptos ecosystem.",
    image: "https://picsum.photos/seed/aptos1/400/400",
    collection: "Aptos Adventurers",
    amount: 1,
  },
  {
    id: "2",
    name: "Blockchain Blossom #87",
    description: "A beautiful digital flower blooming on the Aptos chain.",
    image: "https://picsum.photos/seed/aptos2/400/400",
    collection: "Aptos Flora",
    amount: 3,
  },
  {
    id: "3",
    name: "Quantum Quokka #13",
    description:
      "An adorable quokka representing quantum leaps in blockchain tech.",
    image: "https://picsum.photos/seed/aptos3/400/400",
    collection: "Aptos Fauna",
    amount: 1,
  },
  {
    id: "4",
    name: "Digital Dreamscape #99",
    description:
      "A surreal landscape showcasing the limitless possibilities of Aptos.",
    image: "https://picsum.photos/seed/aptos4/400/400",
    collection: "Aptos Visions",
    amount: 2,
  },
];

export default function AptosNFTShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextNFT = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyNFTs.length);
  };

  const prevNFT = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + dummyNFTs.length) % dummyNFTs.length
    );
  };

  return (
    <div className="w-[400px] h-[500px] mx-auto bg-[#121919] rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* <h2 className="text-2xl font-bold text-center py-4 text-[#06F7F7]">
        Your Aptos NFTs
      </h2> */}
      <div className="relative flex-grow">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-[320px] bg-[#000000] rounded-lg overflow-hidden shadow-xl transform transition-all hover:scale-105 duration-300 border border-[#06F7F7]">
            <img
              src={dummyNFTs[currentIndex].image}
              alt={dummyNFTs[currentIndex].name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#06F7F7] mb-2 truncate">
                {dummyNFTs[currentIndex].name}
              </h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {dummyNFTs[currentIndex].description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#06F7F7] truncate max-w-[60%]">
                  {dummyNFTs[currentIndex].collection}
                </span>
                <span className="bg-[#121919] text-[#06F7F7] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Owned: {dummyNFTs[currentIndex].amount}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        <button
          onClick={prevNFT}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#000000] bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#06F7F7]"
          aria-label="Previous NFT"
        >
          <ChevronLeftIcon className="w-6 h-6 text-[#06F7F7]" />
        </button>
        <button
          onClick={nextNFT}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#000000] bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#06F7F7]"
          aria-label="Next NFT"
        >
          <ChevronRightIcon className="w-6 h-6 text-[#06F7F7]" />
        </button>
      </div>
      <div className="py-4 flex justify-center space-x-2">
        {dummyNFTs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#06F7F7] ${
              index === currentIndex
                ? "bg-[#06F7F7]"
                : "bg-[#000000] hover:bg-[#06F7F7] hover:bg-opacity-50"
            }`}
            aria-label={`View NFT ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
