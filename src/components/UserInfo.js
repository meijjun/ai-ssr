'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UserInfo() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div className="text-center p-4">加载中...</div>;
  }

  if (!session) {
    return (
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          登录
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          注册
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow">
      <div className="text-xl font-bold">欢迎, {session.user.name || session.user.email}</div>
      <div className="text-gray-600">
        {session.user.role === 'ADMIN' ? '管理员' : '普通用户'}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        退出登录
      </button>
    </div>
  );
}