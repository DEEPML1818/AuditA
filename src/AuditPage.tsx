// src/AuditPage.tsx
import  { useState, useEffect, ChangeEvent } from 'react';
import { Container, Button, Heading, Text } from '@radix-ui/themes';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import init from '@iota/client-wasm/web';


import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

// Ethers.js adapter for Wagmi v2 → Viem
import { useEthersSigner } from './ethers';

import './index.css';

type PDFViewerProps = {
  url: string;
};


function PDFViewer({ url }: PDFViewerProps) {
  return <iframe title="PDF Viewer" src={url} width="100%" height="600px" />;
}

type AuditItem = {
  id: number;
  file: File | null;
  text: string;
  fileName: string;
};

const ERC721_ABI = [
  'function mintTo(address to, string uri) external returns (uint256)',
];
// Make sure you’ve set this in .env as VITE_AUDIT_NFT_ADDRESS
const ERC721_ADDRESS = import.meta.env.VITE_AUDIT_NFT_ADDRESS!;

export default function AuditPage() {
  //
  // ─── EVM Wallet Hooks ───────────────────────────────────────────────────────
  //
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const signer = useEthersSigner(); // your custom hook

  //
  // ─── IOTA Audit State ──────────────────────────────────────────────────────
  //
  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    { id: Date.now(), file: null, text: '', fileName: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [fallbackMode, setFallbackMode] = useState(false);
  const [manualAuditReport, setManualAuditReport] = useState('');
  const [mintLoading, setMintLoading] = useState(false);
  const [mintTxResponse, setMintTxResponse] = useState<any>(null);
  const [mintError, setMintError] = useState('');

    console.log(setMintTxResponse, setMintError, setPdfUrl, setMintLoading, setFallbackMode, setManualAuditReport, setSubmitting, setAuditItems)
  //
  // ─── Init IOTA WASM ─────────────────────────────────────────────────────────
  //
  useEffect(() => {
    (init as unknown as () => Promise<void>)().catch((e) => console.error('IOTA WASM init error', e));
  }, []);

  //
  // ─── Helpers ───────────────────────────────────────────────────────────────
  //
  const updateAuditItem = (
    id: number,
    field: keyof AuditItem,
    value: any
  ) =>
    setAuditItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );

  const handleFileChange = (id: number) => (
    e: ChangeEvent<HTMLInputElement>
  ) => updateAuditItem(id, 'file', e.target.files?.[0] ?? null);

  const handleInputChange = (id: number, field: keyof AuditItem) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => updateAuditItem(id, field, e.target.value);

  const addAuditItem = () =>
    setAuditItems((prev) => [
      ...prev,
      { id: Date.now(), file: null, text: '', fileName: '' },
    ]);

  //
  // ─── Call OpenAI ────────────────────────────────────────────────────────────
  //
  async function callAuditAPI(items: AuditItem[]): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_KEY!;
    const parts: string[] = [];

    for (const it of items) {
      if (it.file) {
        const txt = await it.file.text();
        parts.push(`Filename: ${it.fileName || it.file.name}\n${txt}`);
      }
      if (it.text.trim()) {
        parts.push(`Manual Input:\n${it.text}`);
      }
    }

    const prompt = `You are an expert Move smart contract auditor. Analyze these snippets and provide vulnerabilities, recommendations, and a summary:\n\n${parts.join(
      '\n\n---\n\n'
    )}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a smart contract security auditor.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setFallbackMode(true);
      throw new Error(data.error?.message || 'OpenAI error');
    }
    return data.choices[0].message.content;
  }

  //
  // ─── PDF Generation ────────────────────────────────────────────────────────
  //
  function generatePDF(report: string): Blob {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const lines = doc.splitTextToSize(report, 550);
    doc.text(lines, 40, 60);
    return doc.output('blob');
  }

  //
  // ─── Pinata Upload ─────────────────────────────────────────────────────────
  //
  async function uploadToIPFSWithPinata(file: Blob): Promise<string> {
    const pinataApiKey = "2ba7bb21d6984f6781a8";
    const pinataSecretApiKey = "5d728ced44197f09903fdaf628b623d7aa3c8f5ddaa0af8cac104e4b20d35c6e"; // Replace with your Pinata API secret
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    const f  = new File([file], 'audit-report.pdf', { type: file.type });
    const fd = new FormData();
    fd.append('file', f);
    fd.append('pinataMetadata', JSON.stringify({ name: 'Audit Report PDF' }));

    const res = await fetch(url, {
      method: 'POST',
      body: fd,
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });
    const d = await res.json();
    if (!res.ok) {
      throw new Error(typeof d.error === 'object' ? JSON.stringify(d.error) : d.error);
    }
    return `https://gateway.pinata.cloud/ipfs/${d.IpfsHash}`;
  }

  //
  // ─── IOTA Mint Handler ─────────────────────────────────────────────────────
  //
  const handleSubmitAudit = async () => {
    setSubmitting(true);
    try {
      const report = await callAuditAPI(auditItems);
      toast.info('Audit report generated.');
      const blob = generatePDF(report);
      const url = await uploadToIPFSWithPinata(blob);
      setPdfUrl(url);
      toast.success('Audit PDF pinned to IPFS!');
    } catch (e: any) {
      toast.error(e.message || 'Audit failed!');
    } finally {
      setSubmitting(false);
    }
  };

  //
  // ─── Manual Fallback ───────────────────────────────────────────────────────
  //
  const handleManualAuditSubmit = async () => {
    if (!manualAuditReport.trim()) {
      return toast.error('Enter your audit report manually.');
    }
    try {
      const blob = generatePDF(manualAuditReport);
      const url = await uploadToIPFSWithPinata(blob);
      setPdfUrl(url);
      toast.success('Manual audit pinned to IPFS!');
      setFallbackMode(false);
    } catch (e: any) {
      toast.error(e.message || 'Upload failed.');
    }
  };

  //
  // ─── Publish to IOTA ───────────────────────────────────────────────────────
  //
  
  const mintNFT = async () => {
    if (!pdfUrl) return toast.error("No PDF URL available to mint NFT.");
    setMintLoading(true);
   
  };
  //
  // ─── Publish to EVM ───────────────────────────────────────────────────────
  //
  const mintEvmAudit = async (uri: string) => {
    if (!evmConnected || !signer) {
      return toast.error('Please connect your EVM wallet first.');
    }
    setMintLoading(true);
    try {
      const resolvedSigner = await signer;
      const nft = new ethers.Contract(ERC721_ADDRESS, ERC721_ABI, resolvedSigner);
      const tx = await nft.mintTo(evmAddress!, uri);
      const rec = await tx.wait();
      toast.success('EVM NFT minted: ' + rec.transactionHash);
    } catch (e: any) {
      toast.error('EVM mint failed: ' + e.message);
    } finally {
      setMintLoading(false);
    }
  };

  //
  // ─── Render ───────────────────────────────────────────────────────────────
  //
  // inside AuditPage.tsx, replace your return(...) with:

// inside AuditPage.tsx, replace your return(...) with:

  return (
    <Container className="audit-page-container mx-auto max-w-4xl py-8 px-6 space-y-8">

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className="audit-block header-block text-center">
        <Heading className="text-cyber-magenta text-4xl font-bold tracking-wide">
          Smart Contract Audit
        </Heading>
      </div>

      {/* ─── Audit items grid ──────────────────────────────────────────────── */}
      <div className="audit-block items-block">
        <div className="audit-grid grid md:grid-cols-2 gap-6">
          {auditItems.map((it) => (
            <div key={it.id} className="audit-item space-y-3">
              <input
                className="glass w-full"
                placeholder="File Name"
                value={it.fileName}
                onChange={handleInputChange(it.id, 'fileName')}
              />

              <label className="btn-primary block text-center cursor-pointer">
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange(it.id)}
                />
              </label>

              <textarea
                className="glass w-full h-24 font-mono resize-none"
                placeholder="Paste your code here…"
                value={it.text}
                onChange={handleInputChange(it.id, 'text')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Action buttons ────────────────────────────────────────────────── */}
      <div className="audit-block actions-block flex justify-center flex-wrap gap-4">
        <Button className="btn-primary" onClick={addAuditItem}>
          + Add More
        </Button>
        <Button
          className="btn-primary"
          onClick={handleSubmitAudit}
          disabled={submitting}
        >
          {submitting ? <ClipLoader size={18} /> : 'Submit Audit'}
        </Button>
      </div>

      {/* ─── Manual fallback ───────────────────────────────────────────────── */}
      {fallbackMode && !pdfUrl && (
        <div className="audit-block fallback-block space-y-4">
          <Heading as="h4" className="text-cyber-yellow text-center font-semibold">
            Enter Audit Report Manually
          </Heading>
          <textarea
            className="glass w-full h-40 font-mono"
            placeholder="Enter your audit report here..."
            value={manualAuditReport}
            onChange={(e) => setManualAuditReport(e.target.value)}
          />
          <div className="flex justify-center">
            <Button className="btn-primary" onClick={handleManualAuditSubmit}>
              Submit Manual Audit
            </Button>
          </div>
        </div>
      )}

      {/* ─── PDF viewer & publish ───────────────────────────────────────────── */}
      {pdfUrl && (
        <div className="audit-block publish-block space-y-4">
          <Heading as="h4" className="text-cyber-lime text-center font-semibold">
            Audit Report PDF
          </Heading>
          <div className="flex justify-center">
            <div className="pdf-viewer max-w-full border rounded-md overflow-hidden">
              <PDFViewer url={pdfUrl} />
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-4">
            <Button
              className="btn-primary"
              onClick={mintNFT}
              disabled={mintLoading}
            >
              {mintLoading ? <ClipLoader size={18} /> : 'Publish to IOTA'}
            </Button>
            <Button
              className="btn-primary"
              onClick={() => mintEvmAudit(pdfUrl)}
              disabled={!evmConnected || mintLoading}
            >
              {evmConnected
                ? mintLoading
                  ? <ClipLoader size={18} />
                  : 'Mint Audit NFT on EVM'
                : 'Connect EVM Wallet'}
            </Button>
          </div>
        </div>
      )}

      {/* ─── IOTA response ──────────────────────────────────────────────────── */}
      {mintTxResponse && (
        <div className="audit-block response-block text-center">
          <Text className="text-cyber-blue">
            IOTA Message ID: <code>{mintTxResponse.messageId}</code>
          </Text>
        </div>
      )}

      {/* ─── EVM error (optional) ────────────────────────────────────────────── */}
      {mintError && (
        <div className="audit-block response-block text-center">
          <Text className="text-cyber-red">{mintError}</Text>
        </div>
      )}

    </Container>
  );


    
    
}


// ──────────────────────────────────────────────────────────────────────────────