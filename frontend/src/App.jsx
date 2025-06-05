import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import AddMovie from './pages/AddMovie/AddMovie';

import MovieDetail from './pages/MovieDetail/MovieDetail';
import MyMovie from './pages/My Movie/MyMovie';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="counter" element={<Counter />} />
        <Route path="users" element={<Users />} />
        <Route path="addmovie" element={<AddMovie />} />
        <Route path="about" element={<About />} />
        <Route path="/movie/:title" element={<MovieDetail />} />
        <Route path="myMovie" element={<MyMovie />} />
      </Routes>
    </Layout>
  );
}

export default App;
