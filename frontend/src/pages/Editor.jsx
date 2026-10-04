import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) api.get(`/posts/${id}`).then(({ post }) => setForm({ title: post.title, content: post.content, image: post.image || '' })).catch(e => setError(e.message));
  }, [id]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const save = async e => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const saved = id ? await api.put(`/posts/${id}`, form) : await api.post('/posts', form);
      navigate(`/posts/${saved._id}`);
    } catch (err) { setError(err.message); setBusy(false); }
  };

  return (
    <form className="card" onSubmit={save}>
      <h2>{id ? 'Edit post' : 'New post'}</h2>
      <label>Cover image URL (optional)<input type="url" value={form.image} onChange={set('image')} placeholder="https://..." /></label>
      <label>Title<input value={form.title} onChange={set('title')} maxLength={200} required /></label>
      <label>Content<textarea rows="12" value={form.content} onChange={set('content')} required /></label>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
    </form>
  );
}
