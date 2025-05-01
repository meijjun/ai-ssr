'use client';

import { useSession, SessionProvider } from 'next-auth/react';

// 这个组件用于包装需要会话的组件
export function SessionWrapper({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// 这个组件用于获取会话数据
export function SessionConsumer({ children }) {
  const session = useSession();
  return children(session);
}