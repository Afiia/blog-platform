import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, formatDate } from '../api';
import { useAuth } from '../context/AuthContext';

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => api.get(`/posts/${id}`).then(setData).catch(e => setError(e.message)), [id]);
  useEffect(() => { load(); }, [load]);

  const run = async fn => { try { setError(''); await fn(); } catch (e) { setError(e.message); } };
  const removePost = () => window.confirm('Delete this post?') &&
    run(async () => { await api.del(`/posts/${id}`); navigate('/'); });
  const addComment = e => { e.preventDefault(); run(async () => { await api.post(`/posts/${id}/comments`, { text }); setText(''); await load(); }); };
  const removeComment = cid => run(async () => { await api.del(`/posts/${id}/comments/${cid}`); await load(); });

  if (!data) return <p className={error ? 'err' : 'muted'}>{error || 'Loading…'}</p>;
  const { post, comments } = data;

  return (
    <>
      <article className="card">
        {post.image && <img className="cover" src={post.image} alt={post.title} />}
        <h2>{post.title}</h2>
        <div className="muted">by {post.author?.name} · {formatDate(post.createdAt)}</div>
        <p className="prewrap">{post.content}</p>
        {user?.id === post.author?.id && (
          <div className="row">
            <Link className="btn" to={`/posts/${id}/edit`}>Edit</Link>
            <button className="btn btn-danger" onClick={removePost}>Delete</button>
          </div>
        )}
      </article>

      <h3>Comments ({comments.length})</h3>
      {comments.map(c => (
        <div className="card" key={c._id}>
          <div className="muted">{c.author?.name} · {formatDate(c.createdAt)}</div>
          <p className="prewrap">{c.text}</p>
          {user?.id === c.author?.id && <button className="btn btn-danger" onClick={() => removeComment(c._id)}>Delete</button>}
        </div>
      ))}

      {error && <p className="err" role="alert">{error}</p>}
      {user ? (
        <form className="card" onSubmit={addComment}>
          <label>Add a comment<textarea rows="3" value={text} onChange={e => setText(e.target.value)} required /></label>
          <button className="btn">Comment</button>
        </form>
      ) : <p className="muted"><Link to="/login">Log in</Link> to comment.</p>}
    </>
  );
}
