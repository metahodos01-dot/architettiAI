'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkflowGeneratorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect a welcome page
    router.replace('/workflow-generator/welcome');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#F5F5F5'
    }}>
      <div style={{
        textAlign: 'center',
        fontFamily: 'var(--font-headings)',
        color: '#999'
      }}>
        <div className="spinner" style={{ marginBottom: '16px', display: 'inline-block' }}></div>
        <p>Caricamento...</p>
      </div>
    </div>
  );
}
