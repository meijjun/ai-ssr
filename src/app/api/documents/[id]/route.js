import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// 获取单个文档
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: '文档不存在' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('获取文档失败:', error);
    return NextResponse.json({ error: '获取文档失败' }, { status: 500 });
  }
}

// 更新文档
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    // 检查文档是否存在以及用户是否有权限
    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json({ error: '文档不存在' }, { status: 404 });
    }

    if (existingDocument.authorId !== session.user.id) {
      return NextResponse.json({ error: '无权限修改此文档' }, { status: 403 });
    }

    const { title, content, tags, isPublished } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        title,
        content,
        tags,
        isPublished: isPublished || false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('更新文档失败:', error);
    return NextResponse.json({ error: '更新文档失败' }, { status: 500 });
  }
}

// 删除文档
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    // 检查文档是否存在以及用户是否有权限
    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json({ error: '文档不存在' }, { status: 404 });
    }

    if (existingDocument.authorId !== session.user.id) {
      return NextResponse.json({ error: '无权限删除此文档' }, { status: 403 });
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除文档失败:', error);
    return NextResponse.json({ error: '删除文档失败' }, { status: 500 });
  }
}