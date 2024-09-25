import React, { useState, useEffect } from "react";
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

const placeholderSVG = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="320" viewBox="0 0 400 320">
    <rect width="400" height="320" fill="#121919"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#06F7F7" text-anchor="middle" dy=".3em">NFT Image Unavailable</text>
  </svg>
`)}`;

export default function AptosNFTShowcase() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch(
          "/api/getNFTs?address=0x8824ebb6e0d60656f6d4d5bbc408805d9ca6b984aad78b16f42b1dae545d6762"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch NFTs");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setNfts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch NFTs. Please try again later.");
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const nextNFT = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % nfts.length);
  };

  const prevNFT = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length);
  };

  if (loading) {
    return <div className="text-center text-[#06F7F7]">Loading NFTs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center text-[#06F7F7]">
        No NFTs found for this address.
      </div>
    );
  }

  return (
    <div className="w-[400px] h-[500px] mx-auto bg-[#121919] rounded-xl shadow-lg overflow-hidden flex flex-col">
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
              src={nfts[currentIndex].image}
              alt={nfts[currentIndex].name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = placeholderSVG;
                e.currentTarget.alt = "NFT Image Unavailable";
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#06F7F7] mb-2 truncate">
                {nfts[currentIndex].name}
              </h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {nfts[currentIndex].description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#06F7F7] truncate max-w-[60%]">
                  {nfts[currentIndex].collection}
                </span>
                <span className="bg-[#121919] text-[#06F7F7] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Owned: {nfts[currentIndex].amount}
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
        {nfts.map((_, index) => (
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
