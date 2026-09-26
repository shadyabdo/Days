import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/new" element={<Editor />} />
          <Route path="/dashboard/edit/:id" element={<Editor />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
