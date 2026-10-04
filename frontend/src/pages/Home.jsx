import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, formatDate } from '../api';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null);
    api.get(`/posts?page=${page}`).then(setData).catch(e => setError(e.message));
  }, [page]);

  if (error) return <p className="err" role="alert">{error}</p>;
  if (!data) return <p className="muted">Loading…</p>;

  return (
    <>
      {data.posts.map(p => (
        <article className="card" key={p._id}>
          {p.image && <img className="cover" src={p.image} alt="" loading="lazy" />}
          <h3><Link to={`/posts/${p._id}`}>{p.title}</Link></h3>
          <div className="muted">by {p.author?.name} · {formatDate(p.createdAt)}</div>
          <p>{p.content.slice(0, 150)}{p.content.length > 150 && '…'}</p>
        </article>
      ))}
      {!data.posts.length && <p className="muted">No posts yet.</p>}
      <div className="row">
        {page > 1 && <button className="btn" onClick={() => setParams({ page: page - 1 })}>Previous</button>}
        {page < data.pages && <button className="btn" onClick={() => setParams({ page: page + 1 })}>Next</button>}
      </div>
    </>
  );
}
