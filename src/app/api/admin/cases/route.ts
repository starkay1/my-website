import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.case.findMany({ orderBy: { publishedAt: 'desc' }, skip, take: pageSize }),
    prisma.case.count(),
  ]);
  return NextResponse.json({ success: true, data: { items, total, page, pageSize } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await prisma.case.create({ data: body });
  return NextResponse.json({ success: true, data: created });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body || {};
  if (!id) return NextResponse.json({ success: false, message: '缺少 id' }, { status: 400 });
  const updated = await prisma.case.update({ where: { id }, data: rest });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, message: '缺少 id' }, { status: 400 });
  await prisma.case.delete({ where: { id } });
  return NextResponse.json({ success: true });
}