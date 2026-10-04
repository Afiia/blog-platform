const KEY = 'token';
export const tokenStore = {
  get: () => localStorage.getItem(KEY),
  set: t => localStorage.setItem(KEY, t),
  clear: () => localStorage.removeItem(KEY),
};

async function request(path, { method = 'GET', body } = {}) {
  const token = tokenStore.get();
  const res = await fetch(`/api${path}`, {
    method,
    headers: { ...(body && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get: p => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  del: p => request(p, { method: 'DELETE' }),
};

export const formatDate = d => new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' });
