import { Buffer } from "buffer";

// Ensure Buffer is available globally
if (!window.Buffer) {
    window.Buffer = Buffer;
}

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function SendTokens() {
    const wallet = useWallet();
    const { connection } = useConnection();

    async function sendTokens() {
        const toElement = document.getElementById("to");
        const amountElement = document.getElementById("amount");

        if (!toElement || !amountElement) {
            alert("Input fields not found");
            return;
        }

        const to = (toElement as HTMLInputElement).value;
        const amount = (amountElement as HTMLInputElement).value;

        if (!wallet.publicKey) {
            alert("Wallet not connected");
            return;
        }

        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(to),
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "processed");

            alert(`Sent ${amount} SOL to ${to}`);
        } catch (error) {
            console.error("Error sending tokens:", error);
            alert("Failed to send tokens. Check the console for details.");
        }
    }

    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>Send Tokens</h3>
            <input
                id="to"
                type="text"
                placeholder="Recipient Address"
                style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <input
                id="amount"
                type="text"
                placeholder="Amount in SOL"
                style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <button
                onClick={sendTokens}
                style={{ padding: "10px 20px", border: "none", borderRadius: "4px", backgroundColor: "#4caf50", color: "#fff", cursor: "pointer" }}
            >
                Send
            </button>
        </div>
    );
}
