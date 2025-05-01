import UserInfo from '@/components/UserInfo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold">用户认证系统</h1>
        <UserInfo />
      </div>
    </main>
  );
}