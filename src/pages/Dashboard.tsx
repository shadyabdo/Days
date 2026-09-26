import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, deleteArticle, updateArticle } from '../store';
import { CATEGORIES, Category, CATEGORY_ICONS, CATEGORY_COLORS } from '../types';
import ArticleCard from '../components/ArticleCard';

export default function Dashboard() {
  const [articles, setArticles] = useState(getArticles());
  const [selectedCategory, setSelectedCategory] = useState<Category | 'الكل'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteArticle(showDeleteConfirm);
      setArticles(getArticles());
      setShowDeleteConfirm(null);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const handleTogglePin = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      updateArticle(id, { isPinned: !article.isPinned });
      setArticles(getArticles());
    }
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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            <i className="fas fa-cog ml-2 text-indigo-600"></i>
            لوحة التحكم
          </h1>
          <p className="text-stone-500 mt-1">إدارة مقالاتك ومحتواك</p>
        </div>
        <Link
          to="/dashboard/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          مقال جديد
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-file-alt text-indigo-600"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-800">{stats.total}</div>
              <div className="text-xs text-stone-500">إجمالي المقالات</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-thumbtack text-amber-600"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-800">{stats.pinned}</div>
              <div className="text-xs text-stone-500">مثبتة</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-tags text-green-600"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-800">{CATEGORIES.length}</div>
              <div className="text-xs text-stone-500">تصنيفات</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-bar text-purple-600"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-800">
                {stats.total > 0 ? Math.round(stats.total / CATEGORIES.length * 10) / 10 : 0}
              </div>
              <div className="text-xs text-stone-500">متوسط/تصنيف</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-8">
        <h3 className="text-sm font-medium text-stone-600 mb-3">التوزيع حسب التصنيف</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <div key={cat} className={`px-3 py-1.5 rounded-lg text-sm border ${CATEGORY_COLORS[cat]}`}>
              {CATEGORY_ICONS[cat]} {cat}: {stats.categories[cat]}
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
          <input
            type="text"
            placeholder="ابحث في المقالات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Category | 'الكل')}
          className="px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
        >
          <option value="الكل">جميع التصنيفات</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
          ))}
        </select>
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-stone-700 mb-2">لا توجد مقالات</h3>
          <p className="text-stone-500 mb-6">
            {searchQuery || selectedCategory !== 'الكل' ? 'جرب تغيير معايير البحث' : 'ابدأ بكتابة مقالك الأول!'}
          </p>
          <Link
            to="/dashboard/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            اكتب مقالك الأول
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trash text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">حذف المقال</h3>
              <p className="text-stone-500 text-sm mb-6">
                هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
