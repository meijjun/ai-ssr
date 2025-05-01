'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// 动态导入Markdown编辑器，避免SSR问题
const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>,
});

export default function EditDocumentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 如果用户未登录，重定向到登录页面
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/documents/${id}/edit`);
      return;
    }

    if (status === 'authenticated' && id) {
      fetchDocument();
    }
  }, [status, id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${id}`);
      
      if (!response.ok) {
        throw new Error('获取文档失败');
      }
      
      const document = await response.json();
      
      setTitle(document.title);
      setContent(document.content);
      setTags(document.tags.join(', '));
      setIsPublished(document.isPublished);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          isPublished,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '更新文档失败');
      }
      
      // 更新成功后跳转到文档列表页
      router.push('/documents');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">编辑文档</h1>
        <Link
          href="/documents"
          className="text-indigo-600 hover:text-indigo-800"
        >
          返回文档列表
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            标题
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="输入文档标题"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            内容 (支持Markdown)
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="在这里输入文档内容，支持Markdown格式..."
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            标签 (用逗号分隔)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500