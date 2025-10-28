import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Speakers from './components/Speakers';
import Events from './components/Events';
import Partners from './components/Partners';
import Registration from './components/Registration';
import Footer from './components/Footer';
import Auth from './components/Auth';
import ProfileForm from './components/ProfileForm';
import ParticipantExplorer from './components/ParticipantExplorer';
import OrganizationExplorer from './components/OrganizationExplorer';
import ChatRoom from './components/ChatRoom';

// 홈 페이지
function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Speakers />
      <Events />
      <Partners />
      <Registration />
      <Footer />
    </>
  );
}

// 인증 페이지
function AuthPage() {
  const navigate = useNavigate();
  return <Auth onSuccess={() => navigate('/profile')} />;
}

// 내 프로필 설정 페이지
function ProfileSettingsPage() {
  const navigate = useNavigate();
  return <ProfileForm onSuccess={() => navigate('/explorer')} />;
}

// 참가자 탐색 페이지
function ExplorerPage() {
  const navigate = useNavigate();
  const handleChatStart = (profileId: string) => {
    navigate(`/chat/${profileId}`);
  };
  return <ParticipantExplorer onChatStart={handleChatStart} />;
}

// 학회 탐색 페이지
function OrganizationExplorerPage() {
  return <OrganizationExplorer />;
}

// 채팅 페이지
function ChatPage() {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId?: string }>();
  return <ChatRoom otherProfileId={profileId} onClose={() => navigate('/explorer')} />;
}

// 앱 네비게이션
function AppNavigation() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const loadUnreadCount = async () => {
      if (!profile) return;

      try {
        const { getTotalUnreadCount } = await import('./lib/supabase');
        const count = await getTotalUnreadCount(profile.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('안 읽은 메시지 수 로드 오류:', error);
      }
    };

    if (profile) {
      loadUnreadCount();

      // 주기적으로 안 읽은 메시지 수 업데이트 (10초마다)
      const interval = setInterval(loadUnreadCount, 10000);

      // storage 이벤트 리스너 (다른 탭에서 메시지가 왔을 때)
      const handleStorageChange = () => {
        loadUnreadCount();
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('new-message', handleStorageChange);
      window.addEventListener('messages-read', handleStorageChange);

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('new-message', handleStorageChange);
        window.removeEventListener('messages-read', handleStorageChange);
      };
    }
  }, [profile]);

  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="app-navigation">
      <Link to="/">
        홈
      </Link>

      {user ? (
        <>
          <Link
            to="/explorer"
            className={location.pathname === '/explorer' ? 'active' : ''}
          >
            참가자 탐색
          </Link>
          <Link
            to="/organizations"
            className={location.pathname === '/organizations' ? 'active' : ''}
          >
            학회 탐색
          </Link>
          <Link
            to="/profile"
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            내 프로필
          </Link>
          <Link
            to="/chat"
            className={`message-link ${location.pathname.startsWith('/chat') ? 'active' : ''}`}
          >
            메시지
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </Link>
        </>
      ) : (
        <Link
          to="/auth"
          className={location.pathname === '/auth' ? 'active' : ''}
        >
          로그인
        </Link>
      )}
    </nav>
  );
}

function AppContent() {
  return (
    <div className="App">
      <AppNavigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="/explorer" element={<ExplorerPage />} />
        <Route path="/organizations" element={<OrganizationExplorerPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:profileId" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;