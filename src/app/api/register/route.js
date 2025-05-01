import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // 添加调试日志
    console.log('注册请求数据:', { name, email, password: '***' });
    
    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码是必填项' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 密码加密
    const hashedPassword = await hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 返回用户信息（不包含密码）
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    // 详细记录错误信息
    console.error('注册失败详细错误:', error);
    
    return NextResponse.json(
      { error: '注册失败，请稍后再试' },
      { status: 500 }
    );
  }
}