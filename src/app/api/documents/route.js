import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// 获取当前用户的所有文档
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: {
        authorId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('获取文档列表失败:', error);
    return NextResponse.json({ error: '获取文档列表失败' }, { status: 500 });
  }
}

// 创建新文档
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { title, content, tags, isPublished } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
        tags: tagsString,
        isPublished: isPublished || false,
        author: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('创建文档失败:', error);
    return NextResponse.json({ error: '创建文档失败' }, { status: 500 });
  }
}