'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 动态导入Markdown渲染器，避免SSR问题
const MarkdownPreview = dynamic(() => import('@/components/MarkdownPreview'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>,
});

export default function DocumentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${id}`);
      
      if (!response.ok) {
        throw new Error('获取文档失败');
      }
      
      const data = await response.json();
      setDocument(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文档吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除文档失败');
      }

      // 删除成功后跳转到文档列表页
      router.push('/documents');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link href="/documents" className="text-indigo-600 hover:text-indigo-800">
            返回文档列表
          </Link>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          文档不存在或已被删除
        </div>
        <div className="mt-4">
          <Link href="/documents" className="text-indigo-600 hover:text-indigo-800">
            返回文档列表
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = session?.user?.id === document.authorId;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{document.title}</h1>
        <div className="flex space-x-4">
          <Link
            href="/documents"
            className="text-indigo-600 hover:text-indigo-800"
          >
            返回文档列表
          </Link>
          {isAuthor && (
            <>
              <Link
                href={`/documents/${id}/edit`}
                className="text-indigo-600 hover:text-indigo-800"
              >
                编辑
              </Link>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
              >
                删除
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <span>
            {new Date(document.updatedAt).toLocaleString()} · 
            {document.isPublished ? ' 已发布' : ' 草稿'}
          </span>
        </div>
        <div className="mt-2">
          {document.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6">
          <MarkdownPreview content={document.content} />
        </div>
      </div>
    </div>
  );
}