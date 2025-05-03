// src/AuditPage.tsx
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import init, { Client } from '@iota/sdk';         // aliased to wasm/web via Vite config
import { networkConfig } from './networkConfig';

// -----------------------------------------------------------------------------
// Glassmorphic PDF preview panel
function PDFViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-96 border border-cyber-border rounded-md overflow-hidden glass">
      <iframe src={url} title="PDF Viewer" className="w-full h-full" />
    </div>
  );
}

type AuditItem = {
  id: number;
  file: File | null;
  text: string;
  fileName: string;
};

export default function AuditPage() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    { id: Date.now(), file: null, text: '', fileName: '' },
  ]);
  const [submitting, setSubmitting]       = useState(false);
  const [pdfUrl, setPdfUrl]               = useState('');
  const [fallbackMode, setFallbackMode]   = useState(false);
  const [manualAuditReport, setManualAuditReport] = useState('');
  const [mintLoading, setMintLoading]     = useState(false);
  const [mintTxResponse, setMintTxResponse] = useState<any>(null);
  const [mintError, setMintError]         = useState('');

  // ─── Load IOTA WASM once ───────────────────────────────────────────────────
  useEffect(() => {
    init().catch((e) => console.error('IOTA WASM init error', e));
  }, []);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const updateAuditItem = (id: number, field: keyof AuditItem, value: any) =>
    setAuditItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );

  const handleFileChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) =>
    updateAuditItem(id, 'file', e.target.files?.[0] ?? null);

  const handleInputChange = (id: number, field: keyof AuditItem) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => updateAuditItem(id, field, e.target.value);

  const addAuditItem = () =>
    setAuditItems((prev) => [
      ...prev,
      { id: Date.now(), file: null, text: '', fileName: '' },
    ]);

  // ─── Call OpenAI (stub, fallback to manual) ───────────────────────────────
  async function callAuditAPI(items: AuditItem[]): Promise<string> {
    const apiKey = ''; // ← MOVE THIS TO import.meta.env.VITE_OPENAI_KEY
    const parts: string[] = [];

    for (const it of items) {
      if (it.file) {
        parts.push(
          `Filename: ${it.fileName || it.file.name}\n${await it.file.text()}`
        );
      }
      if (it.text.trim()) {
        parts.push(`Manual Input:\n${it.text}`);
      }
    }

    const prompt = `You're an expert auditor...\n\n${parts.join(
      '\n\n---\n\n'
    )}`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a smart contract auditor.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'OpenAI error');
      return data.choices[0].message.content;
    } catch {
      setFallbackMode(true);
      throw new Error(
        'Audit API failed. Please enter your report manually below.'
      );
    }
  }

  // ─── PDF Generation ────────────────────────────────────────────────────────
  function generatePDF(report: string): Blob {
    const doc = new jsPDF();
    doc.text(report, 10, 10);
    return doc.output('blob');
  }

  // ─── Pinata Upload ────────────────────────────────────────────────────────
  async function uploadToIPFSWithPinata(file: Blob): Promise<string> {
    const pinataApiKey       = ''; // ← MOVE TO import.meta.env
    const pinataSecretApiKey = '';
    const url                = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

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
      throw new Error(
        typeof d.error === 'object' ? JSON.stringify(d.error) : d.error
      );
    }
    return `https://gateway.pinata.cloud/ipfs/${d.IpfsHash}`;
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSubmitAudit = async () => {
    setSubmitting(true);
    try {
      const report = await callAuditAPI(auditItems);
      toast.info('Audit report generated.');
      const blob = generatePDF(report);
      const url  = await uploadToIPFSWithPinata(blob);
      setPdfUrl(url);
      toast.success('Audit PDF pinned to IPFS!');
    } catch (e: any) {
      toast.error(e.message || 'Audit failed!');
    }
    setSubmitting(false);
  };

  const handleManualAuditSubmit = async () => {
    if (!manualAuditReport.trim()) {
      return toast.error('Enter your audit report manually.');
    }
    try {
      const blob = generatePDF(manualAuditReport);
      const url  = await uploadToIPFSWithPinata(blob);
      setPdfUrl(url);
      toast.success('Manual audit pinned to IPFS!');
      setFallbackMode(false);
    } catch (e: any) {
      toast.error(e.message || 'Upload failed.');
    }
  };

  const mintNFT = async () => {
    if (!pdfUrl) {
      return toast.error('No PDF URL to publish.');
    }
    setMintLoading(true);
    try {
      const client = new Client({ nodes: [networkConfig.devnet.url] });
      const data   = new TextEncoder().encode(pdfUrl);
      const msg    = await client.sendMessage({
        index: 'AUDIT_REPORT',
        data,
      });
      setMintTxResponse({ messageId: msg.messageId });
      toast.success('Published to IOTA: ' + msg.messageId);
    } catch (e: any) {
      setMintError(e.message || 'Publish failed');
      toast.error(e.message);
    } finally {
      setMintLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Container className="space-y-6">
      <Heading className="text-cyber-magenta">Smart Contract Audit</Heading>

      {auditItems.map((it) => (
        <Flex
          key={it.id}
          direction="column"
          className="glass p-4 space-y-2"
        >
          <input
            className="glass p-2 border-cyber-border rounded"
            placeholder="File Name"
            value={it.fileName}
            onChange={handleInputChange(it.id, 'fileName')}
          />
          <input
            type="file"
            className="text-sm"
            onChange={handleFileChange(it.id)}
          />
          <textarea
            className="glass p-2 border-cyber-border rounded h-24 resize-none"
            placeholder="Paste your code here…"
            value={it.text}
            onChange={handleInputChange(it.id, 'text')}
          />
        </Flex>
      ))}

      <Flex className="space-x-4">
        <Button
          className="glass px-4 py-2 animate-pulsate"
          onClick={addAuditItem}
        >
          + Add More
        </Button>
        <Button
          className="glass px-4 py-2 animate-pulsate"
          onClick={handleSubmitAudit}
          disabled={submitting}
        >
          {submitting ? <ClipLoader size={18} /> : 'Submit Audit'}
        </Button>
      </Flex>

      {fallbackMode && !pdfUrl && (
        <Container className="space-y-4 mt-4">
          <Heading as="h4" className="text-cyber-yellow">
            Enter Audit Report Manually
          </Heading>
          <textarea
            className="glass p-2 border-cyber-border rounded w-full h-40"
            placeholder="Enter your audit report here..."
            value={manualAuditReport}
            onChange={(e) => setManualAuditReport(e.target.value)}
          />
          <Button
            className="glass px-4 py-2 animate-pulsate"
            onClick={handleManualAuditSubmit}
          >
            Submit Manual Audit
          </Button>
        </Container>
      )}

      {pdfUrl && (
        <Container className="space-y-4 mt-4">
          <Heading as="h4" className="text-cyber-lime">
            Audit Report PDF
          </Heading>
          <PDFViewer url={pdfUrl} />
          <Button
            className="glass px-4 py-2 animate-pulsate"
            onClick={mintNFT}
            disabled={mintLoading}
          >
            {mintLoading ? <ClipLoader size={18} /> : 'Publish to IOTA'}
          </Button>
        </Container>
      )}

      {mintTxResponse && (
        <Text className="text-cyber-blue mt-2">
          IOTA Message ID: <code>{mintTxResponse.messageId}</code>
        </Text>
      )}
      {mintError && (
        <Text className="text-cyber-red mt-2">{mintError}</Text>
      )}
    </Container>
  );
}
