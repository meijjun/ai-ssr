'use client';

import Link from 'next/link';
import UserMenu from './UserMenu';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          AI-SSR
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/documents" className="text-gray-700 hover:text-indigo-600">
            文档管理
          </Link>
          <Link href="/documents/new" className="text-gray-700 hover:text-indigo-600">
            新建文档
          </Link>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}