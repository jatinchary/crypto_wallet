import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const LAMPORTS_PER_SOL = 1000000000; // 1 SOL = 1,000,000,000 lamports

const AirDrop: React.FC = () => {
    const [amount, setAmount] = useState<number | undefined>();
    const [balance, setBalance] = useState<number | null>(null);
    const [status, setStatus] = useState<string>('');
    const wallet = useWallet();
    const { connection } = useConnection();

    useEffect(() => {
        getBalance();
    }, [wallet.publicKey, connection]);

    async function sendAirDrop() {
        if (!wallet.publicKey || amount == null || amount <= 0) {
            setStatus('Please connect your wallet and enter an amount.');
            return;
        }

        try {
            setStatus('Requesting airdrop...');
            const signature = await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature, 'confirmed');
            setStatus(`Successfully airdropped ${amount} SOL`);
            getBalance();
        } catch (error) {
            setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async function getBalance() {
        if (wallet.publicKey) {
            try {
                const balance = await connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            margin: '20px auto',
            fontFamily: 'Arial, sans-serif',
        }}>
            <h2 style={{
                color: '#333',
                marginBottom: '20px',
            }}>
                Solana Airdrop
            </h2>
            <input 
                type="number" 
                value={amount || ''}
                onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Enter amount (SOL)" 
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                }}
            />
            <button 
                onClick={sendAirDrop}
                disabled={!wallet.publicKey || amount == null}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: wallet.publicKey && amount != null ? '#4CAF50' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: wallet.publicKey && amount != null ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.3s',
                    marginBottom: '10px',
                }}
                onMouseOver={(e) => {
                    if (wallet.publicKey && amount != null) e.currentTarget.style.backgroundColor = '#45a049';
                }}
                onMouseOut={(e) => {
                    if (wallet.publicKey && amount != null) e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
            >
                Request Airdrop
            </button>
            <div style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#e0e0e0',
                borderRadius: '5px',
                marginBottom: '10px',
                boxSizing: 'border-box',
            }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>SOL Balance:</p>
                <p style={{ margin: 0 }}>{balance !== null ? balance.toFixed(9) : 'Loading...'}</p>
            </div>
            {status && (
                <div style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: status.startsWith('Error') ? '#ffcccc' : '#ccffcc',
                    borderRadius: '5px',
                    marginTop: '10px',
                    boxSizing: 'border-box',
                }}>
                    {status}
                </div>
            )}
        </div>
    );
}

export default AirDrop;

