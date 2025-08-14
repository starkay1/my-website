"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, Button, Input, Textarea, RichTextEditor } from "@/components/ui";

interface NewsItem {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  authorName: string;
  authorTitle?: string;
  authorAvatar?: string;
  publishedAt?: string;
  readTime?: number;
  image?: string;
  tags?: string[];
  featured?: boolean;
}

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocal(value: string) {
  if (!value) return undefined;
  // Ensure it is ISO string
  const date = new Date(value);
  return date.toISOString();
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const emptyForm: NewsItem = useMemo(
    () => ({ slug: "", title: "", content: "", category: "general", authorName: "Admin", featured: false, readTime: 5 }),
    []
  );
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<NewsItem>(emptyForm);
  const [tagsText, setTagsText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/news?page=${p}&pageSize=${ps}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data.items);
        setTotal(data.data.total);
        setPage(data.data.page);
        setPageSize(data.data.pageSize);
      } else {
        setError(data.message || "加载失败");
      }
    } catch (e: any) {
      setError(e.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setTagsText("");
    setError(null);
  };

  const onCreate = () => {
    resetForm();
    setEditing(null);
  };

  const onEdit = (it: NewsItem) => {
    setEditing(it);
    setForm({ ...it });
    setTagsText((it.tags || []).join(", "));
  };

  const onDelete = async (id: string) => {
    if (!confirm("确认删除该新闻？")) return;
    await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
    load(page, pageSize);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        ...form,
        tags: tagsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (payload.publishedAt) {
        payload.publishedAt = fromDateTimeLocal(payload.publishedAt);
      }
      // 默认 readTime
      if (!payload.readTime) payload.readTime = 5;

      const isEdit = Boolean(form.id);
      const res = await fetch("/api/admin/news", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "提交失败");
      resetForm();
      load(isEdit ? page : 1, pageSize);
    } catch (e: any) {
      setError(e.message || "提交失败");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">新闻管理</h2>
              <p className="text-sm text-neutral-600">共 {total} 条</p>
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" label="每页" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="w-28" />
              <Button onClick={() => load(1, pageSize)} loading={loading}>
                刷新
              </Button>
              <Button onClick={onCreate}>新增</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 列表 */}
      <div className="space-y-4">
        {items.map((it) => (
          <Card key={it.id}>
            <CardContent className="flex items-start justify-between gap-6">
              <div>
                <div className="font-medium">
                  {it.title}
                  <span className="ml-2 text-xs text-neutral-500">{it.category}</span>
                  {it.featured ? <span className="ml-2 text-xs text-amber-600">[置顶]</span> : null}
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  {new Date(it.publishedAt || it.id!).toLocaleString()} · {it.authorName}
                </div>
                {it.excerpt && <p className="mt-2 text-neutral-700">{it.excerpt}</p>}
                {it.tags && it.tags.length > 0 && (
                  <div className="mt-2 text-xs text-neutral-600">标签：{it.tags.join(", ")}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 min-w-[200px]">
                <Button variant="outline" onClick={() => onEdit(it)}>编辑</Button>
                <Button variant="secondary" onClick={() => onDelete(it.id!)}>删除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" disabled={page <= 1} onClick={() => load(page - 1, pageSize)}>
          上一页
        </Button>
        <span className="text-sm">
          {page} / {totalPages}
        </span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => load(page + 1, pageSize)}>
          下一页
        </Button>
      </div>

      {/* 表单 */}
      {editing && (
        <Card>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{form.id ? "编辑新闻" : "新增新闻"}</h3>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  关闭
                </Button>
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Input label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Input label="标题" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="分类" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="作者" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
                <Input label="作者头衔" value={form.authorTitle || ""} onChange={(e) => setForm({ ...form, authorTitle: e.target.value })} />
              </div>
              <Input label="作者头像 URL" value={form.authorAvatar || ""} onChange={(e) => setForm({ ...form, authorAvatar: e.target.value })} />
              <Input label="封面图 URL" value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <Input
                label="发布时间"
                type="text"
                value={toDateTimeLocal(form.publishedAt)}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              />
              <Input
                label="阅读时长（分钟）"
                type="number"
                value={form.readTime || 5}
                onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })}
              />
              <Input label="标签（逗号分隔）" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
              <Textarea label="摘要" value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: (e.target as any).value })} />
              <RichTextEditor 
                label="正文" 
                value={form.content} 
                onChange={(value) => setForm({ ...form, content: value })} 
                placeholder="请输入新闻正文内容..."
                height="400px"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  置顶显示
                </label>
              </div>
              {form.id && <input type="hidden" value={form.id} />}
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={resetForm}>
                  重置
                </Button>
                <Button type="submit" loading={loading}>
                  {form.id ? "保存" : "创建"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}