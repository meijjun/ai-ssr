'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 处理点击事件，切换菜单显示状态
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // 处理退出登录
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // 点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 如果会话正在加载，显示加载状态
  if (status === 'loading') {
    return <div className="text-sm text-gray-500">加载中...</div>;
  }

  // 如果用户未登录，不显示任何内容
  if (!session) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <span className="hidden md:inline">{session.user.name || session.user.email}</span>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          {(session.user.name || session.user.email).charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <p className="font-medium">{session.user.name || '用户'}</p>
            <p className="text-gray-500 truncate">{session.user.email}</p>
          </div>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            个人资料
          </Link>
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              管理后台
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}