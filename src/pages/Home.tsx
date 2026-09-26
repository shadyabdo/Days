import { useState, useMemo } from 'react';
import { getArticles, searchArticles } from '../store';
import { CATEGORIES, Category, CATEGORY_ICONS } from '../types';
import ArticleCard from '../components/ArticleCard';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'الكل'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const allArticles = useMemo(() => {
    if (searchQuery.trim()) {
      return searchArticles(searchQuery);
    }
    return getArticles();
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'الكل') return allArticles;
    return allArticles.filter(a => a.category === selectedCategory);
  }, [allArticles, selectedCategory]);

  const pinnedArticles = filteredArticles.filter(a => a.isPinned);
  const regularArticles = filteredArticles.filter(a => !a.isPinned);

  const stats = useMemo(() => {
    const articles = getArticles();
    return {
      total: articles.length,
      categories: CATEGORIES.reduce((acc, cat) => {
        acc[cat] = articles.filter(a => a.category === cat).length;
        return acc;
      }, {} as Record<Category, number>),
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
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
          {/* Pinned Articles */}
          {pinnedArticles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-amber-600 mb-4 flex items-center gap-2">
                <i className="fas fa-thumbtack"></i>
                مقالات مثبتة
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pinnedArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
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
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
