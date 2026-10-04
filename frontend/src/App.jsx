import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout, RequireAuth } from './components/Layout';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import Editor from './pages/Editor';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="posts/:id" element={<PostPage />} />
            <Route path="posts/:id/edit" element={<RequireAuth><Editor /></RequireAuth>} />
            <Route path="new" element={<RequireAuth><Editor /></RequireAuth>} />
            <Route path="login" element={<AuthPage mode="login" />} />
            <Route path="register" element={<AuthPage mode="register" />} />
            <Route path="*" element={<p className="muted">Page not found.</p>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
