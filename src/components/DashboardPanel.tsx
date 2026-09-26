import { useState } from 'react';
import { Article, CATEGORIES, Category, CATEGORY_ICONS, CATEGORY_COLORS } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface DashboardPanelProps {
  articles: Article[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onView: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
}

export default function DashboardPanel({
  articles,
  onEdit,
  onDelete,
  onTogglePin,
  onView,
  onNew,
  onClose,
}: DashboardPanelProps) {
  const [filterCategory, setFilterCategory] = useState<Category | 'الكل'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = articles.filter(a => {
    const matchCategory = filterCategory === 'الكل' || a.category === filterCategory;
    const matchSearch = !searchQuery.trim() || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const stats = {
    total: articles.length,
    pinned: articles.filter(a => a.isPinned).length,
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <i className="fas fa-th-large text-indigo-600"></i>
            لوحة التحكم
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-2 border border-stone-200 text-center">
            <div className="text-lg font-bold text-indigo-600">{stats.total}</div>
            <div className="text-xs text-stone-500">مقال</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-stone-200 text-center">
            <div className="text-lg font-bold text-amber-600">{stats.pinned}</div>
            <div className="text-xs text-stone-500">مثبت</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 border-b border-stone-200 space-y-3">
        <div className="relative">
          <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
          <input
            type="text"
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterCategory('الكل')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              filterCategory === 'الكل'
                ? 'bg-indigo-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            الكل
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-stone-500 text-sm">لا توجد مقالات</p>
          </div>
        ) : (
          filtered.map(article => (
            <ArticleListItem
              key={article.id}
              article={article}
              onView={() => onView(article.id)}
              onEdit={() => onEdit(article.id)}
              onDelete={() => setDeleteConfirmId(article.id)}
              onTogglePin={() => onTogglePin(article.id)}
            />
          ))
        )}
      </div>

      {/* New Article Button */}
      <div className="p-4 border-t border-stone-200 bg-stone-50">
        <button
          onClick={onNew}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i>
          كتابة مقال جديد
        </button>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-trash text-red-500 text-lg"></i>
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-1">حذف المقال؟</h3>
              <p className="text-stone-500 text-sm mb-4">لا يمكن التراجع عن هذا الإجراء</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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

function ArticleListItem({
  article,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}: {
  article: Article;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  const date = format(new Date(article.createdAt), 'dd MMM', { locale: ar });
  const excerpt = article.content.replace(/[#*`>\-\[\]()!]/g, '').replace(/\n/g, ' ').substring(0, 60);

  return (
    <div className="group bg-white rounded-xl border border-stone-200 hover:border-indigo-200 hover:shadow-sm transition-all p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${CATEGORY_COLORS[article.category]}`}>
              {CATEGORY_ICONS[article.category]}
            </span>
            {article.isPinned && (
              <span className="text-[10px] text-amber-600">📌</span>
            )}
            <span className="text-[10px] text-stone-400">{date}</span>
          </div>
          <button
            onClick={onView}
            className="text-sm font-medium text-stone-800 hover:text-indigo-600 transition-colors text-right block w-full truncate"
          >
            {article.title}
          </button>
          <p className="text-xs text-stone-400 truncate mt-0.5">{excerpt}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onTogglePin}
            className={`p-1.5 rounded-md hover:bg-amber-50 transition-colors ${article.isPinned ? 'text-amber-500' : 'text-stone-400 hover:text-amber-500'}`}
            title={article.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
          >
            <i className="fas fa-thumbtack text-xs"></i>
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md hover:bg-blue-50 text-stone-400 hover:text-blue-600 transition-colors"
            title="تعديل"
          >
            <i className="fas fa-edit text-xs"></i>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
            title="حذف"
          >
            <i className="fas fa-trash text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
