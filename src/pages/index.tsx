import React from "react";
import NFTshowcase from "@/components/functional/NFTshowcase";
import TokenShowcase from "@/components/functional/TokenShowcase";
import TransactionList from "@/components/functional/TransactionList";

const Home = () => {
  return (
    <div>
      {/* <NFTshowcase /> */}
      {/* <TokenShowcase /> */}
      <TransactionList address="0x274c398a921b8e2ba345feac3039e1c8b196a7eb1395cdd3584af3a85eb9ec50" />
    </div>
  );
};

export default Home;
