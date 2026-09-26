import { Article, CATEGORY_COLORS, CATEGORY_ICONS } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const excerpt = article.content
    .replace(/[#*`>\-\[\]()!]/g, '')
    .replace(/\n/g, ' ')
    .substring(0, 150) + '...';

  const date = format(new Date(article.createdAt), 'dd MMMM yyyy', { locale: ar });

  return (
    <article className={`group bg-white rounded-2xl border border-stone-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 overflow-hidden ${article.isPinned ? 'ring-2 ring-amber-200' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[article.category]}`}>
              {CATEGORY_ICONS[article.category]} {article.category}
            </span>
            {article.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                📌 مثبت
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-stone-800 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
          {excerpt}
        </p>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 4).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md text-xs">
                #{tag}
              </span>
            ))}
            {article.tags.length > 4 && (
              <span className="px-2 py-0.5 text-stone-400 text-xs">
                +{article.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">
            <i className="far fa-calendar-alt ml-1"></i>
            {date}
          </span>
          <span className="text-xs text-indigo-600 font-medium">
            اقرأ المزيد ←
          </span>
        </div>
      </div>
    </article>
  );
}
