'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 动态导入编辑器，避免SSR问题
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

// 导入样式
import 'easymde/dist/easymde.min.css';

export default function MarkdownEditor({ value, onChange, placeholder }) {
  const [mounted, setMounted] = useState(false);

  // 在客户端渲染后再加载编辑器
  useEffect(() => {
    setMounted(true);
  }, []);

  const options = {
    autofocus: true,
    spellChecker: false,
    placeholder: placeholder || '在这里输入Markdown内容...',
    status: ['lines', 'words', 'cursor'],
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', 'table', 'code', '|',
      'preview', 'side-by-side', 'fullscreen', '|',
      'guide'
    ],
  };

  if (!mounted) {
    return (
      <div className="h-64 border border-gray-300 rounded-md p-2 bg-gray-50">
        加载编辑器中...
      </div>
    );
  }

  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={options}
      className="prose max-w-none"
    />
  );
}