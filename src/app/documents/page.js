'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 如果用户未登录，重定向到登录页面
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/documents');
      return;
    }

    if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents');
      
      if (!response.ok) {
        throw new Error('获取文档列表失败');
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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

      // 删除成功后刷新文档列表
      fetchDocuments();
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的文档</h1>
        <Link
          href="/documents/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          新建文档
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">您还没有创建任何文档</p>
          <Link
            href="/documents/new"
            className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
          >
            立即创建
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/documents/${doc.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {doc.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.updatedAt).toLocaleString()} · 
                      {doc.isPublished ? ' 已发布' : ' 草稿'}
                    </p>
                    <div className="mt-1">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/documents/${doc.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}