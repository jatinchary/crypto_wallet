// import React, { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// import dotenv from "dotenv"
// import { clusterApiUrl } from '@solana/web3.js';

import "@solana/wallet-adapter-react-ui/styles.css";
import AirDrop from "./components/AirDrop";
import { SignMessage } from "./components/SignMessage";
import { SendTokens } from "./components/SendTokens";
// import { SendTokens } from './SendTokens';
// import { SignMessage } from './SignMessage';
// dotenv.config();

function App() {
  // const network = WalletAdapterNetwork.Devnet;

  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider
      endpoint={
        "https://api.devnet.solana.com"
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="flex justify-between p-5">
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
          <AirDrop />

          <SignMessage />
      <SendTokens/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
