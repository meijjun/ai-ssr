import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  const path = request.nextUrl.pathname;
  
  // 公开路由，不需要登录也可以访问
  const publicPaths = ['/login', '/register', '/api', '/_next', '/static', '/favicon.ico'];
  const isPublicPath = publicPaths.some(pp => path.startsWith(pp));
  
  // 如果用户未登录且不是公开路径，重定向到登录页
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // 需要保护的路由
  const protectedPaths = ['/dashboard', '/profile'];
  // 管理员专用路由
  const adminPaths = ['/admin'];
  
  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp));
  // 检查是否是管理员路径
  const isAdminPath = adminPaths.some(ap => path.startsWith(ap));
  
  // 如果是管理员路径但用户不是管理员，重定向到首页
  if (isAdminPath && (!isAuthenticated || token.role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // 如果用户已登录但访问登录或注册页，重定向到首页
  if (isAuthenticated && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};