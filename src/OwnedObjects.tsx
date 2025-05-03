// src/OwnedObjects.tsx
import { useEffect, useState } from 'react';
import { Container, Heading, Text } from '@radix-ui/themes';
import { networkConfig } from './networkConfig';
import { motion } from 'framer-motion';

export default function OwnedObjects() {
  const [messageIds, setMessageIds] = useState<string[]>([]);
  const [error, setError]         = useState<string>('');

  useEffect(() => {
    async function fetchMessages() {
      try {
        const idxUrl = networkConfig.devnet.indexerUrl;
        const res = await fetch(
          `${idxUrl}/api/indexer/v1/messages?index=AUDIT_REPORT`
        );
        if (!res.ok) throw new Error(`Indexer responded ${res.status}`);
        const json = (await res.json()) as { data: string[] };
        setMessageIds(json.data);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch messages');
      }
    }

    fetchMessages();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 mt-6"
    >
      <Heading size="2" className="text-neonPink mb-2">
        Audit Reports on IOTA
      </Heading>

      {error ? (
        <Text className="text-neonRed mt-2">{error}</Text>
      ) : messageIds.length === 0 ? (
        <Text className="text-gray-400 mt-2">No reports found.</Text>
      ) : (
        <ul className="list-disc list-inside space-y-1 mt-2">
          {messageIds.map((id) => (
            <li key={id}>
              <a
                href={`${networkConfig.devnet.jsonRpcUrl.replace(
                  '/api',
                  '/core/v2/messages'
                )}/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neonBlue hover:underline"
              >
                {id}
              </a>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
