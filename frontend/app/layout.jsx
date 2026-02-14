'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../styles/globals.css';
import { getCurrentWallet } from '@/lib/web3Utils';

export default function RootLayout({ children }) {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkAccount();
    if (typeof window !== 'undefined') {
      window.ethereum?.on('accountsChanged', () => checkAccount());
    }
  }, []);

  const checkAccount = async () => {
    try {
      const acc = await getCurrentWallet();
      setAccount(acc);
    } catch (error) {
      console.error('Error checking account:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed');
        return;
      }
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="CredChain Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="text-2xl font-bold">CredChain</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-blue-200">
                Home
              </Link>
              <Link href="/admin" className="hover:text-blue-200">
                Admin
              </Link>
              <Link href="/issuer" className="hover:text-blue-200">
                Issuer
              </Link>
              <Link href="/student" className="hover:text-blue-200">
                Student
              </Link>
              <Link href="/verify" className="hover:text-blue-200">
                Verify
              </Link>

              {account ? (
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-700 px-3 py-2 rounded text-sm">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>© 2026 CredChain - Blockchain Academic Credential Verification</p>
            <p className="text-sm text-gray-400">Sepolia Testnet</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
