"use client";
import { useState } from 'react';
import { Input, Button, Card, CardHeader, CardContent } from '@/components/ui';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || '登录失败');
      }
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/admin';
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">管理员登录</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Input label="邮箱" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="密码" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" loading={loading} fullWidth>
              登录
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}