'use client';

import { useState, useRef } from 'react';
import { verifyCredential } from '@/lib/web3Utils';

export default function VerifyPage() {
  const [eduId, setEduId] = useState('');
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searched, setSearched] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const html5QrcodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!eduId.trim()) {
      setMessage('Please enter an EduID');
      return;
    }

    setLoading(true);
    setMessage('');
    setSearched(false);

    try {
      const { exists, credential: cred } = await verifyCredential(eduId);

      if (!exists) {
        setMessage('❌ Credential not found');
        setCredential(null);
      } else {
        setCredential(cred);
        setMessage(cred.revoked ? '⚠️ This credential has been revoked' : '✓ Credential verified');
      }
      setSearched(true);
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Verify Credential</h1>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter EduID or scan QR code:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eduId}
                onChange={(e) => setEduId(e.target.value)}
                placeholder="e.g., 0x1234567890..."
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  setScannerError('');
                  if (scanning) {
                    try {
                      if (html5QrcodeRef.current) await html5QrcodeRef.current.stop();
                    } catch (e) {
                      console.error('Error stopping scanner:', e);
                    }
                    setScanning(false);
                    return;
                  }

                  try {
                    const { Html5Qrcode } = await import('html5-qrcode');
                    const elementId = 'qr-reader';
                    const html5Qr = new Html5Qrcode(elementId);
                    html5QrcodeRef.current = html5Qr;
                    const devices = await Html5Qrcode.getCameras();
                    const cameraId = (devices && devices.length) ? devices[0].id : undefined;
                    setScanning(true);

                    await html5Qr.start(
                      cameraId || { facingMode: 'environment' },
                      { fps: 10, qrbox: 250 },
                      (decodedText) => {
                        setEduId(decodedText);
                        html5Qr.stop().catch(() => {});
                        setScanning(false);
                        setScannerError('');
                      },
                      (errorMessage) => {
                        // per-frame decode errors ignored
                      }
                    );
                  } catch (err) {
                    console.error('QR scanner error:', err);
                    setScannerError('QR scanner unavailable. Install html5-qrcode or use a compatible browser.');
                    setScanning(false);
                  }
                }}
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {scanning ? 'Stop Scan' : 'Scan QR'}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Upload QR Image
              </button>
              </div>
            </div>
            {scannerError && <p className="text-sm text-red-600 mt-2">{scannerError}</p>}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              setScannerError('');
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const { Html5Qrcode } = await import('html5-qrcode');
                // try scanFileV2 (returns object) then scanFile
                if (Html5Qrcode.scanFileV2) {
                  const result = await Html5Qrcode.scanFileV2(file, true);
                  const decoded = result?.decodedText || result;
                  if (decoded) setEduId(decoded);
                } else if (Html5Qrcode.scanFile) {
                  const decoded = await Html5Qrcode.scanFile(file, true);
                  if (decoded) setEduId(decoded);
                } else {
                  setScannerError('QR decode method not available in html5-qrcode');
                }
              } catch (err) {
                console.error('Image QR decode error:', err);
                setScannerError('Unable to decode QR from uploaded image');
              } finally {
                // clear the input so same file can be reselected
                e.target.value = '';
              }
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? 'Verifying...' : 'Verify Credential'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>

      {/* QR Scanner Preview */}
      {scanning && (
        <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-md mb-8">
          <div id="qr-reader" className="w-full" />
          <p className="text-sm text-gray-500 mt-2">Point your camera at the QR code to scan the EduID.</p>
        </div>
      )}

      {/* Verification Result */}
      {searched && credential && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="mb-6">
            <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${credential.revoked ? 'bg-red-500' : 'bg-green-500'}`}>
              {credential.revoked ? 'REVOKED' : 'VALID'}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">EduID</p>
              <p className="font-mono text-sm break-all">{eduId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="text-lg font-semibold">{credential.studentName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Institution</p>
              <p className="text-lg">{credential.institutionName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Credential Type</p>
              <p className="text-lg">{credential.credentialType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Course/Program</p>
              <p className="text-lg">{credential.courseOrProgram}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Issued Date</p>
              <p className="text-lg">
                {new Date(Number(credential.issueDate) * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Issuer (Institution Wallet)</p>
              <p className="font-mono text-sm break-all">{credential.issuer}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Student Wallet</p>
              <p className="font-mono text-sm break-all">{credential.studentWallet}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Document Hash</p>
              <p className="font-mono text-xs break-all">{credential.documentHash}</p>
            </div>

            {credential.revoked && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 font-semibold">⚠️ This credential has been revoked</p>
                <p className="text-sm text-red-700 mt-1">This credential is no longer valid.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {searched && !credential && (
        <div className="max-w-2xl mx-auto bg-red-50 p-8 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">Credential Not Found</p>
          <p className="text-sm text-red-700 mt-2">The EduID you entered could not be found on the blockchain.</p>
        </div>
      )}
    </div>
  );
}
