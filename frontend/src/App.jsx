import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import About from './About';
import Credits from './Credits';
import Contact from './Contact';
import Sidebar from './Sidebar';
import Books from "./Books";
import Users from './Users';
import Dashboard from './Dashboard';
import Footer from './Footer';
import LoginSignUp from './LoginSignUp';

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
          <Route path="/login" element={
            <FullScreenLayout>
              <LoginSignUp />
            </FullScreenLayout>
          } />
          <Route path="/" element={
            <MainLayout>
              <Home />
            </MainLayout>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;