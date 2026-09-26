import { Article, Category } from './types';

const STORAGE_KEY = 'personal-blog-articles';

export function getArticles(): Article[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading articles:', e);
  }
  return getDefaultArticles();
}

export function saveArticles(articles: Article[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Error saving articles:', e);
  }
}

export function addArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article {
  const articles = getArticles();
  const newArticle: Article = {
    ...article,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  articles.unshift(newArticle);
  saveArticles(articles);
  return newArticle;
}

export function updateArticle(id: string, updates: Partial<Article>): Article | null {
  const articles = getArticles();
  const index = articles.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveArticles(articles);
  return articles[index];
}

export function deleteArticle(id: string): boolean {
  const articles = getArticles();
  const filtered = articles.filter(a => a.id !== id);
  if (filtered.length === articles.length) return false;
  saveArticles(filtered);
  return true;
}

export function getArticleById(id: string): Article | null {
  const articles = getArticles();
  return articles.find(a => a.id === id) || null;
}

export function getArticlesByCategory(category: Category): Article[] {
  return getArticles().filter(a => a.category === category);
}

export function searchArticles(query: string): Article[] {
  const lower = query.toLowerCase();
  return getArticles().filter(a => 
    a.title.toLowerCase().includes(lower) ||
    a.content.toLowerCase().includes(lower) ||
    a.tags.some(t => t.toLowerCase().includes(lower))
  );
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getDefaultArticles(): Article[] {
  const defaults: Article[] = [
    {
      id: generateId(),
      title: 'مرحباً بك في مدونتي 🎉',
      content: `# مرحباً بك في مدونتي!\n\nهذا هو المقال الأول في مدونتي الشخصية. هنا سأشارك:\n\n- **يومياتي** - ما أ مر به يومياً\n- **أهدافي** - ما أسعى لتحقيقه\n- **أفكاري** - خواطر وتأملات\n- **ملاحظات** - أشياء أتعلمها\n\n> الحياة رحلة، وهذه المدونة هي سجل رحلتي.\n\nيمكنك استخدام لوحة التحكم لإضافة مقالات جديدة وتعديلها وحذفها. كل البيانات تُحفظ محلياً في متصفحك.`,
      category: 'عام',
      tags: ['ترحيب', 'بداية'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: true,
    },
    {
      id: generateId(),
      title: 'أهدافي لهذا الشهر 🎯',
      content: `# أهدافي لهذا الشهر\n\n## أهداف شخصية\n1. قراءة كتابين على الأقل\n2. ممارسة الرياضة 3 مرات أسبوعياً\n3. تعلم مهارة جديدة\n\n## أهداف مهنية\n- إكمال المشروع الحالي\n- تحسين مهاراتي في البرمجة\n- كتابة مقالات تقنية\n\n## أهداف صحية\n- النوم مبكراً\n- شرب كمية كافية من الماء\n- تناول طعام صحي\n\n> "النجاح ليس نهائياً والفشل ليس قاتلاً، الشجاعة للاستمرار هي ما يهم" - ونستون تشرشل`,
      category: 'أهداف',
      tags: ['أهداف', 'تخطيط', 'تطوير ذات'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      isPinned: false,
    },
    {
      id: generateId(),
      title: 'فكرة: تطبيق لإدارة الوقت ⏰',
      content: `# فكرة مشروع جديد\n\n## الفكرة\nتطبيق بسيط لإدارة الوقت يعتمد على تقنية **Pomodoro** مع إضافة:\n\n- تتبع المهام اليومية\n- إحصائيات أسبوعية\n- تذكيرات ذكية\n- وضع التركيز\n\n## لماذا هذه الفكرة؟\nلأن إدارة الوقت من أكبر التحديات التي أواجهها. أعتقد أن بناء أداة خاصة بي ستساعدني كثيراً.\n\n## الخطوات القادمة\n1. رسم التصميم الأولي\n2. اختيار التقنيات المناسبة\n3. بناء النسخة الأولية (MVP)\n4. اختبارها على نفسي لمدة أسبوع`,
      category: 'أفكار',
      tags: ['مشروع', 'تطبيق', 'إنتاجية'],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      isPinned: false,
    },
  ];
  saveArticles(defaults);
  return defaults;
}
