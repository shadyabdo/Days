import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticleById } from '../store';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = id ? getArticleById(id) : null;

  if (!article) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-stone-700 mb-2">المقال غير موجود</h2>
        <p className="text-stone-500 mb-6">ربما تم حذفه أو أن الرابط غير صحيح</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const createdDate = format(new Date(article.createdAt), 'dd MMMM yyyy، hh:mm a', { locale: ar });
  const updatedDate = format(new Date(article.updatedAt), 'dd MMMM yyyy، hh:mm a', { locale: ar });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <i className="fas fa-arrow-right"></i>
        العودة
      </button>

      {/* Article Header */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Category & Pin */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${CATEGORY_COLORS[article.category]}`}>
              {CATEGORY_ICONS[article.category]} {article.category}
            </span>
            {article.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                📌 مثبت
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-stone-400 mb-6 flex-wrap">
            <span>
              <i className="far fa-calendar-alt ml-1"></i>
              كُتب في: {createdDate}
            </span>
            {article.createdAt !== article.updatedAt && (
              <span>
                <i className="far fa-edit ml-1"></i>
                عُدّل في: {updatedDate}
              </span>
            )}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <hr className="border-stone-100 mb-6" />

          {/* Content */}
          <div className="prose prose-stone prose-lg max-w-none" dir="rtl">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-stone-800 mt-6 mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-stone-700 mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold text-stone-700 mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-stone-600 leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pr-6 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pr-6 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-stone-600">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-r-4 border-indigo-300 pr-4 py-2 my-4 bg-indigo-50 rounded-l-lg text-stone-600 italic">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-stone-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-stone-800 text-stone-100 p-4 rounded-xl overflow-x-auto mb-4 text-sm" dir="ltr">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => <strong className="font-bold text-stone-800">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                hr: () => <hr className="border-stone-200 my-6" />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 border-t border-stone-100 px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-stone-500 hover:text-indigo-600 transition-colors"
          >
            <i className="fas fa-arrow-right ml-1"></i>
            جميع المقالات
          </Link>
          <Link
            to={`/dashboard/edit/${article.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <i className="fas fa-edit ml-1"></i>
            تعديل المقال
          </Link>
        </div>
      </div>
    </div>
  );
}
