import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById, addArticle, updateArticle } from '../store';
import { CATEGORIES, Category, CATEGORY_ICONS } from '../types';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('عام');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) {
      const article = getArticleById(id);
      if (article) {
        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category);
        setTagsInput(article.tags.join('، '));
        setIsPinned(article.isPinned);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('يرجى إدخال عنوان للمقال');
      return;
    }
    if (!content.trim()) {
      alert('يرجى إدخال محتوى المقال');
      return;
    }

    setIsSaving(true);

    const tags = tagsInput
      .split(/[,،\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const articleData = {
      title: title.trim(),
      content,
      category,
      tags,
      isPinned,
    };

    setTimeout(() => {
      if (isEditing && id) {
        updateArticle(id, articleData);
      } else {
        addArticle(articleData);
      }
      setIsSaving(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus-circle'} ml-2 text-indigo-600`}></i>
            {isEditing ? 'تعديل المقال' : 'مقال جديد'}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {isEditing ? 'قم بتعديل محتوى المقال' : 'اكتب مقالك وشارك أفكارك'}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-stone-500 hover:text-stone-700 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {/* Title */}
        <div className="p-6 border-b border-stone-100">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان المقال..."
            className="w-full text-2xl font-bold text-stone-800 placeholder-stone-300 focus:outline-none"
          />
        </div>

        {/* Meta */}
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                <i className="fas fa-folder ml-1"></i>
                التصنيف
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      category === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-indigo-200'
                    }`}
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                <i className="fas fa-tags ml-1"></i>
                الوسوم (مفصولة بفاصلة)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="مثال: يوميات، تأملات، أهداف"
                className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
              />
            </div>
          </div>

          {/* Pin Toggle */}
          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPinned(!isPinned)}
                className={`w-10 h-6 rounded-full transition-colors relative ${isPinned ? 'bg-amber-400' : 'bg-stone-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isPinned ? 'right-1' : 'left-1'}`}></div>
              </div>
              <span className="text-sm text-stone-600">
                <i className="fas fa-thumbtack ml-1 text-amber-500"></i>
                تثبيت المقال في الأعلى
              </span>
            </label>
          </div>
        </div>

        {/* Content Editor */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-stone-600">
              <i className="fas fa-pen ml-1"></i>
              المحتوى (يدعم Markdown)
            </label>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                showPreview
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <i className={`fas ${showPreview ? 'fa-eye-slash' : 'fa-eye'} ml-1`}></i>
              {showPreview ? 'إخفاء المعاينة' : 'معاينة'}
            </button>
          </div>

          <div className={`${showPreview ? 'grid grid-cols-2 gap-4' : ''}`}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب مقالك هنا... يمكنك استخدام تنسيق Markdown:

# عنوان رئيسي
## عنوان فرعي
**نص عريض**
*نص مائل*
- قائمة نقطية
1. قائمة مرقمة
> اقتباس
`كود`"
              className="w-full h-96 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none font-mono text-sm leading-relaxed"
              dir="rtl"
            />
            {showPreview && (
              <div className="h-96 overflow-auto p-4 bg-white border border-stone-200 rounded-xl prose prose-sm prose-stone max-w-none" dir="rtl">
                {content ? (
                  <div className="whitespace-pre-wrap text-stone-600 text-sm leading-relaxed">
                    {content.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-stone-800 mb-2">{line.slice(2)}</h1>;
                      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-stone-700 mb-2">{line.slice(3)}</h2>;
                      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-stone-700 mb-1">{line.slice(4)}</h3>;
                      if (line.startsWith('> ')) return <blockquote key={i} className="border-r-4 border-indigo-300 pr-3 py-1 my-1 bg-indigo-50 rounded-l text-stone-600 italic">{line.slice(2)}</blockquote>;
                      if (line.startsWith('- ')) return <li key={i} className="list-disc mr-4 text-stone-600">{line.slice(2)}</li>;
                      if (line.match(/^\d+\. /)) return <li key={i} className="list-decimal mr-4 text-stone-600">{line.replace(/^\d+\. /, '')}</li>;
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i} className="text-stone-600 mb-1">{line}</p>;
                    })}
                  </div>
                ) : (
                  <p className="text-stone-400 text-center mt-8">ستظهر المعاينة هنا...</p>
                )}
              </div>
            )}
          </div>

          {/* Markdown Help */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-100 px-2 py-1 rounded"># عنوان</span>
            <span className="bg-stone-100 px-2 py-1 rounded">**عريض**</span>
            <span className="bg-stone-100 px-2 py-1 rounded">*مائل*</span>
            <span className="bg-stone-100 px-2 py-1 rounded">- قائمة</span>
            <span className="bg-stone-100 px-2 py-1 rounded">&gt; اقتباس</span>
            <span className="bg-stone-100 px-2 py-1 rounded">`كود`</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 text-stone-600 hover:text-stone-800 font-medium transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                جاري الحفظ...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                {isEditing ? 'حفظ التعديلات' : 'نشر المقال'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
