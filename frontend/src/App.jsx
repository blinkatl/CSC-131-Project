import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './Home';
import About from './About';
import Credits from './Credits';
import Contact from './Contact';
import Sidebar from './Sidebar';
import Books from "./Books";
import Users from './Users';
import Dashboard from './Dashboard';
import UserDashboard from './UserDashboard'; 
import UserBooks from './UserBooks';
import Footer from './Footer';
import LoginSignUp from './LoginSignUp';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';
import UserMembership from './UserMembership';
import Settings from './Settings';

const MainLayout = ({ children }) => (
  <div className="main-content">
    <Sidebar />
    <div className="content-area">
      <div className="content-wrapper">
        {children}
      </div>
      <Footer />
    </div>
  </div>
);

const FullScreenLayout = ({ children }) => (
  <div className="fullscreen-layout">
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <div className='app-container'>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* Public routes */}
          <Route path="/login" element={
            <FullScreenLayout>
              <LoginSignUp />
            </FullScreenLayout>
          } />
          <Route path="/home" element={
            <FullScreenLayout>
              <Home />
            </FullScreenLayout>
          } />
          <Route path="/about" element={
            <MainLayout>
              <About />
            </MainLayout>
          } />
          <Route path="/credits" element={
            <MainLayout>
              <Credits />
            </MainLayout>
          } />
          <Route path="/contact" element={
            <MainLayout>
              <Contact />
            </MainLayout>
          } />
          <Route path="/settings" element={
            <MainLayout>
              <Settings />
            </MainLayout>
          } />
          
          {/* User protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={
              <MainLayout>
                <UserDashboard />
              </MainLayout>
            } />
            <Route path="/books" element={
              <MainLayout>
                <UserBooks />
              </MainLayout>
            } />
            <Route path="/membership" element={
              <MainLayout>
                <UserMembership />
              </MainLayout>
            } />
          </Route>
          
          
          {/* Admin protected routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/admin/books" element={
              <MainLayout>
                <Books />
              </MainLayout>
            } />
            <Route path="/admin/users" element={
              <MainLayout>
                <Users />
              </MainLayout>
            } />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;