import { SessionWrapper } from '@/components/SessionWrapper';
import BlankPageClient from '@/components/BlankPageClient';

export default function BlankPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-600">AI-SSR</h2>
          <SessionWrapper>
            <BlankPageClient />
          </SessionWrapper>
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">欢迎使用</h1>
          <p className="mt-4 text-gray-600">您已成功登录系统</p>
        </div>
      </div>
    </div>
  );
}