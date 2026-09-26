import { Article, CATEGORY_COLORS, CATEGORY_ICONS } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onEdit: () => void;
}

export default function ArticleView({ article, onBack, onEdit }: ArticleViewProps) {
  const createdDate = format(new Date(article.createdAt), 'dd MMMM yyyy، hh:mm a', { locale: ar });
  const updatedDate = format(new Date(article.updatedAt), 'dd MMMM yyyy، hh:mm a', { locale: ar });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <i className="fas fa-arrow-right"></i>
        العودة للرئيسية
      </button>

      {/* Article */}
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

          <hr className="border-stone-100 mb-6" />

          {/* Content - Simple Markdown Rendering */}
          <div className="prose prose-stone max-w-none" dir="rtl">
            {renderMarkdown(article.content)}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-100 px-6 sm:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-stone-500 hover:text-indigo-600 transition-colors"
          >
            <i className="fas fa-arrow-right ml-1"></i>
            جميع المقالات
          </button>
          <button
            onClick={onEdit}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <i className="fas fa-edit ml-1"></i>
            تعديل المقال
          </button>
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      if (inList) {
        inList = false;
      }
      elements.push(<br key={i} />);
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-bold text-stone-700 mt-4 mb-2">{formatInline(trimmed.slice(4))}</h3>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-stone-700 mt-5 mb-2">{formatInline(trimmed.slice(3))}</h2>);
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-stone-800 mt-6 mb-3">{formatInline(trimmed.slice(2))}</h1>);
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-r-4 border-indigo-300 pr-4 py-2 my-4 bg-indigo-50 rounded-l-lg text-stone-600 italic">
          {formatInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        inList = true;
        listType = 'ul';
      }
      elements.push(
        <li key={i} className="text-stone-600 mr-4 list-disc mb-1">
          {formatInline(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s(.+)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        inList = true;
        listType = 'ol';
      }
      elements.push(
        <li key={i} className="text-stone-600 mr-4 list-decimal mb-1">
          {formatInline(olMatch[2])}
        </li>
      );
      return;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={i} className="border-stone-200 my-6" />);
      return;
    }

    // Regular paragraph
    inList = false;
    elements.push(<p key={i} className="text-stone-600 leading-relaxed mb-4">{formatInline(trimmed)}</p>);
  });

  return <>{elements}</>;
}

function formatInline(text: string): React.ReactNode {
  // Bold
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index} className="font-bold text-stone-800">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={match.index} className="italic">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(<code key={match.index} className="bg-stone-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">{match[4]}</code>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}
