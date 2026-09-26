import { useState, useMemo, useCallback } from 'react';
import { Article, CATEGORIES, Category, CATEGORY_ICONS, CATEGORY_COLORS } from './types';
import { getArticles, addArticle, updateArticle, deleteArticle } from './store';
import ArticleCard from './components/ArticleCard';
import ArticleView from './components/ArticleView';
import DashboardPanel from './components/DashboardPanel';
import EditorPanel from './components/EditorPanel';

type View = 'home' | 'article' | 'dashboard' | 'editor';

function App() {
  const [view, setView] = useState<View>('home');
  const [articles, setArticles] = useState<Article[]>(getArticles());
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'الكل'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshArticles = useCallback(() => {
    setArticles(getArticles());
  }, []);

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategory !== 'الكل') {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(lower) ||
        a.content.toLowerCase().includes(lower) ||
        a.tags.some(t => t.toLowerCase().includes(lower))
      );
    }
    return result;
  }, [articles, selectedCategory, searchQuery]);

  const selectedArticle = useMemo(() => {
    if (!selectedArticleId) return null;
    return articles.find(a => a.id === selectedArticleId) || null;
  }, [articles, selectedArticleId]);

  const editingArticle = useMemo(() => {
    if (!editingArticleId) return null;
    return articles.find(a => a.id === editingArticleId) || null;
  }, [articles, editingArticleId]);

  const handleViewArticle = (id: string) => {
    setSelectedArticleId(id);
    setView('article');
    setDashboardOpen(false);
  };

  const handleGoHome = () => {
    setView('home');
    setDashboardOpen(false);
    setSelectedArticleId(null);
  };

  const handleOpenDashboard = () => {
    setDashboardOpen(true);
    setView('dashboard');
  };

  const handleCloseDashboard = () => {
    setDashboardOpen(false);
    setView('home');
  };

  const handleNewArticle = () => {
    setEditingArticleId(null);
    setView('editor');
    setDashboardOpen(false);
  };

  const handleEditArticle = (id: string) => {
    setEditingArticleId(id);
    setView('editor');
  };

  const handleDeleteArticle = (id: string) => {
    deleteArticle(id);
    refreshArticles();
  };

  const handleTogglePin = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      updateArticle(id, { isPinned: !article.isPinned });
      refreshArticles();
    }
  };

  const handleSaveArticle = (data: { title: string; content: string; category: Category; tags: string[]; isPinned: boolean }) => {
    if (editingArticleId) {
      updateArticle(editingArticleId, data);
    } else {
      addArticle(data);
    }
    refreshArticles();
    setView('home');
    setEditingArticleId(null);
  };

  const handleCancelEditor = () => {
    setView('home');
    setEditingArticleId(null);
  };

  const stats = useMemo(() => {
    return {
      total: articles.length,
      pinned: articles.filter(a => a.isPinned).length,
      categories: CATEGORIES.reduce((acc, cat) => {
        acc[cat] = articles.filter(a => a.category === cat).length;
        return acc;
      }, {} as Record<Category, number>),
    };
  }, [articles]);

  const pinnedArticles = filteredArticles.filter(a => a.isPinned);
  const regularArticles = filteredArticles.filter(a => !a.isPinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100" dir="rtl">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <button onClick={handleGoHome} className="flex items-center gap-2 text-xl font-bold text-stone-800 hover:text-indigo-600 transition-colors">
              <span className="text-2xl">📝</span>
              <span className="hidden sm:inline">مدونتي</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGoHome}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'home' && !dashboardOpen
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                }`}
              >
                <i className="fas fa-home ml-2"></i>
                الرئيسية
              </button>
              <button
                onClick={handleOpenDashboard}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dashboardOpen
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                }`}
              >
                <i className="fas fa-th-large ml-2"></i>
                لوحة التحكم
              </button>
              <button
                onClick={handleNewArticle}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <i className="fas fa-plus ml-1"></i>
                <span className="hidden sm:inline">مقال جديد</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${dashboardOpen ? 'max-w-[calc(100%-400px)]' : 'max-w-6xl mx-auto'} px-4 sm:px-6 py-8 w-full`}>
          
          {/* HOME VIEW */}
          {(view === 'home' || view === 'dashboard') && !editingArticleId && (
            <div>
              {/* Hero */}
              <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4">
                  مرحباً بك في مدونتي ✨
                </h1>
                <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                  هنا أشارك يومياتي، أهدافي، أفكاري، وكل ما يجول في خاطري.
                  <br />
                  مساحة شخصية للتعبير والتأمل والنمو.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                <div className="bg-white rounded-xl p-4 border border-stone-200 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                  <div className="text-xs text-stone-500 mt-1">مقال</div>
                </div>
                {CATEGORIES.map(cat => (
                  <div key={cat} className="bg-white rounded-xl p-4 border border-stone-200 text-center">
                    <div className="text-2xl font-bold text-stone-700">{stats.categories[cat]}</div>
                    <div className="text-xs text-stone-500 mt-1">{CATEGORY_ICONS[cat]} {cat}</div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
                <input
                  type="text"
                  placeholder="ابحث في المقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                />
              </div>

              {/* Categories Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setSelectedCategory('الكل')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === 'الكل'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  الكل
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-indigo-200 hover:text-indigo-600'
                    }`}
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </button>
                ))}
              </div>

              {/* Articles */}
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-stone-700 mb-2">لا توجد مقالات</h3>
                  <p className="text-stone-500">
                    {searchQuery ? 'جرب كلمة بحث مختلفة' : 'ابدأ بكتابة مقالك الأول!'}
                  </p>
                </div>
              ) : (
                <div>
                  {pinnedArticles.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-amber-600 mb-4 flex items-center gap-2">
                        <i className="fas fa-thumbtack"></i>
                        مقالات مثبتة
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {pinnedArticles.map(article => (
                          <div key={article.id} onClick={() => handleViewArticle(article.id)} className="cursor-pointer">
                            <ArticleCard article={article} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {regularArticles.length > 0 && (
                    <div>
                      {pinnedArticles.length > 0 && (
                        <h3 className="text-sm font-medium text-stone-500 mb-4 flex items-center gap-2">
                          <i className="fas fa-clock"></i>
                          أحدث المقالات
                        </h3>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {regularArticles.map(article => (
                          <div key={article.id} onClick={() => handleViewArticle(article.id)} className="cursor-pointer">
                            <ArticleCard article={article} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ARTICLE VIEW */}
          {view === 'article' && selectedArticle && (
            <ArticleView
              article={selectedArticle}
              onBack={handleGoHome}
              onEdit={() => handleEditArticle(selectedArticle.id)}
            />
          )}

          {/* EDITOR VIEW */}
          {view === 'editor' && (
            <EditorPanel
              article={editingArticle}
              onSave={handleSaveArticle}
              onCancel={handleCancelEditor}
            />
          )}
        </main>

        {/* Dashboard Sidebar Panel */}
        <div
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-full sm:w-[400px] bg-white border-l border-stone-200 shadow-2xl transition-transform duration-300 z-30 overflow-hidden ${
            dashboardOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <DashboardPanel
            articles={articles}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
            onTogglePin={handleTogglePin}
            onView={handleViewArticle}
            onNew={handleNewArticle}
            onClose={handleCloseDashboard}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-stone-500 text-sm">
          <p>مدونتي الشخصية © {new Date().getFullYear()} — جميع الذكريات محفوظة ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
