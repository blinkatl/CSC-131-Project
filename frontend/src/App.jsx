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

function App() {
  return (
    <Router>
      <div className='app-container'>
        <div className="main-content">
          <Sidebar />
          <div className="content-area">
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/books" element={<Books />} />
                <Route path="/admin/users" element={<Users />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;