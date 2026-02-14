'use client';

import { useState, useEffect } from 'react';
import { verifyCredential } from '@/lib/web3Utils';
import { useParams } from 'next/navigation';

export default function VerifyDetailPage() {
  const params = useParams();
  const eduId = params.eduId;
  
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCredential();
  }, [eduId]);

  const loadCredential = async () => {
    try {
      const { exists, credential: cred } = await verifyCredential(eduId);

      if (!exists) {
        setMessage('Credential not found');
        setCredential(null);
      } else {
        setCredential(cred);
        setMessage(cred.revoked ? '⚠️ This credential has been revoked' : '✓ Credential verified');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error loading credential');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <div className="bg-red-50 p-8 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold text-lg">Credential Not Found</p>
          <p className="text-sm text-red-700 mt-2">The credential you're looking for could not be found on the blockchain.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className={`inline-block px-6 py-2 rounded-full text-white font-bold text-lg ${credential.revoked ? 'bg-red-500' : 'bg-green-500'}`}>
            {credential.revoked ? '❌ REVOKED' : '✅ VALID CREDENTIAL'}
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{credential.studentName}</h1>
            <p className="text-gray-600 mt-2">{credential.credentialType}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Institution</p>
              <p className="text-lg text-gray-800">{credential.institutionName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Course/Program</p>
              <p className="text-lg text-gray-800">{credential.courseOrProgram}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Issue Date</p>
              <p className="text-lg text-gray-800">
                {new Date(Number(credential.issueDate) * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Status</p>
              <p className={`text-lg font-semibold ${credential.revoked ? 'text-red-600' : 'text-green-600'}`}>
                {credential.revoked ? 'Revoked' : 'Active'}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-500 font-semibold mb-2">EduID (Blockchain ID)</p>
            <p className="font-mono text-sm break-all text-gray-700">{eduId}</p>
          </div>

          <div className="space-y-4 mb-8 text-sm">
            <div>
              <p className="text-gray-500 font-semibold">Issuer Address</p>
              <p className="font-mono break-all text-gray-700">{credential.issuer}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Student Wallet</p>
              <p className="font-mono break-all text-gray-700">{credential.studentWallet}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Document Hash</p>
              <p className="font-mono text-xs break-all text-gray-700">{credential.documentHash}</p>
            </div>
          </div>

          {credential.revoked && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-800 font-bold">⚠️ This credential has been revoked</p>
              <p className="text-sm text-red-700 mt-1">This credential is no longer valid. Contact the issuing institution for more information.</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-gray-500">
              This credential is stored on the Sepolia Ethereum testnet and can be independently verified on the blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
