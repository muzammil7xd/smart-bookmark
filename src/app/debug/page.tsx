'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Get the actual redirect URI being used
    const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`;

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    setDebugInfo({
      windowLocation: typeof window !== 'undefined' ? window.location.origin : 'Not available',
      redirectUri: redirectUri,
      supabaseUrl: supabaseUrl,
      googleClientId: googleClientId,
      timestamp: new Date().toLocaleString(),
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">🔍 Debug Configuration</h1>

        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h2 className="font-bold text-blue-900 mb-2">Redirect URI (What your app is sending):</h2>
            <code className="text-lg bg-white p-3 rounded block break-all border border-blue-200">
              {debugInfo.redirectUri}
            </code>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h2 className="font-bold text-green-900 mb-2">Window Location Origin:</h2>
            <code className="text-lg bg-white p-3 rounded block break-all border border-green-200">
              {debugInfo.windowLocation}
            </code>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
            <h2 className="font-bold text-purple-900 mb-2">Supabase URL:</h2>
            <code className="text-lg bg-white p-3 rounded block break-all border border-purple-200">
              {debugInfo.supabaseUrl}
            </code>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
            <h2 className="font-bold text-orange-900 mb-2">Google Client ID:</h2>
            <code className="text-lg bg-white p-3 rounded block break-all border border-orange-200">
              {debugInfo.googleClientId}
            </code>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h2 className="font-bold text-yellow-900 mb-2">📋 What to Add in Google Cloud Console:</h2>
            <p className="text-sm text-yellow-800 mb-2">Go to Credentials → Your OAuth App → Authorized redirect URIs</p>
            <p className="text-sm text-yellow-800 mb-2">Add this exact URL:</p>
            <code className="text-lg bg-white p-3 rounded block break-all border border-yellow-200 mb-2">
              {debugInfo.redirectUri}
            </code>
            <p className="text-sm text-yellow-800">Plus the Supabase callback URL for production.</p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <h2 className="font-bold text-red-900 mb-2">⚠️ Common Issues:</h2>
            <ul className="text-sm text-red-800 space-y-2 list-disc list-inside">
              <li>Make sure redirect URI in Google Console matches EXACTLY (including http:// or https://)</li>
              <li>Don't add trailing slashes or extra parameters</li>
              <li>Save after adding the redirect URI</li>
              <li>Clear browser cache and try again</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="mt-8 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-bold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

