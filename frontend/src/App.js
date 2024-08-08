import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import CreateBlog from './components/CreateBlog';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import Blog from './pages/Blog';

function App() {
  const LocationAwareNavbar = () => {
    const location = useLocation();
    return !['/login', '/register', '/create', '/profile', '/edit'].includes(location.pathname) ? <Navbar /> : null;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <LocationAwareNavbar />
        <div className="pages">
          <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/create' element={<CreateBlog />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/edit' element={<Edit />} />
            <Route path='/blog' element={<Blog />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
