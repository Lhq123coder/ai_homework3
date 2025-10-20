import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MapPin, LogOut, PlusCircle, Home } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: 'var(--surface)',
        boxShadow: 'var(--shadow)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'var(--primary)',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            <MapPin size={28} />
            <span>AI 旅行助手</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              color: 'var(--text)',
              borderRadius: '0.5rem',
              transition: 'background-color 0.2s'
            }}>
              <Home size={20} />
              <span>我的行程</span>
            </Link>

            <Link to="/plan" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              transition: 'background-color 0.2s'
            }}>
              <PlusCircle size={20} />
              <span>规划新行程</span>
            </Link>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid var(--border)'
            }}>
              <span style={{ color: 'var(--text-light)' }}>{user?.name}</span>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <LogOut size={18} />
                <span>退出</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        color: 'var(--text-light)'
      }}>
        <p>&copy; 2024 AI 旅行规划助手. 智能规划，精彩旅程.</p>
      </footer>
    </div>
  );
}

