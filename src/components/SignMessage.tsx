import { useState } from 'react';
import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

export function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    async function onClick() {
        if (!publicKey) {
            setStatus('Error: Wallet not connected!');
            return;
        }
        if (!signMessage) {
            setStatus('Error: Wallet does not support message signing!');
            return;
        }
        
        try {
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
                throw new Error('Message signature invalid!');
            }
            setStatus(`Success: Message signature: ${bs58.encode(signature)}`);
        } catch (error) {
            setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

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
                Sign Message
            </h2>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to sign"
                aria-label="Message to sign"
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
                onClick={onClick}
                disabled={!message}
                aria-label="Sign message"
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: message ? '#4CAF50' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: message ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => {
                    if (message) e.currentTarget.style.backgroundColor = '#45a049';
                }}
                onMouseOut={(e) => {
                    if (message) e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
            >
                Sign Message
            </button>
            {status && (
                <div
                    role="alert"
                    aria-live="polite"
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: status.startsWith('Error') ? '#ffcccc' : '#ccffcc',
                        color: '#333',
                        width: '100%',
                        boxSizing: 'border-box',
                        wordBreak: 'break-word',
                    }}
                >
                    {status}
                </div>
            )}
        </div>
    );
}

