'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';

interface ColorCardProps {
  name: string;
  hex: string;
  usage: string;
  textColor?: string;
  border?: boolean;
}

export default function ColorCard({
  name,
  hex,
  usage,
  textColor = 'white',
  border = false
}: ColorCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group">
      <div
        className={`rounded-lg p-6 mb-3 aspect-square flex flex-col justify-between transition-transform hover:scale-105 ${border ? 'border-2 border-gray-200' : ''}`}
        style={{ backgroundColor: hex }}
      >
        <div className={`${textColor === 'white' ? 'text-white' : 'text-[#4A4A4A]'} font-semibold`}>
          {name}
        </div>
        <button
          onClick={handleCopy}
          className={`${textColor === 'white' ? 'text-white' : 'text-[#4A4A4A]'} opacity-0 group-hover:opacity-100 transition-opacity text-sm flex items-center gap-2`}
          title="Copy hex code"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="text-sm">
        <div className="font-mono font-semibold text-[#4A4A4A]">{hex}</div>
        <div className="text-[#7A7A7A] text-xs mt-1">{usage}</div>
      </div>
    </div>
  );
}
