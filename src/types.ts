export type Category = 'يوميات' | 'أهداف' | 'أفكار' | 'ملاحظات' | 'عام';

export interface Article {
  id: string;
  title: string;
  content: string;
  category: Category;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export const CATEGORIES: Category[] = ['يوميات', 'أهداف', 'أفكار', 'ملاحظات', 'عام'];

export const CATEGORY_ICONS: Record<Category, string> = {
  'يوميات': '📖',
  'أهداف': '🎯',
  'أفكار': '💡',
  'ملاحظات': '📝',
  'عام': '📌',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  'يوميات': 'bg-purple-100 text-purple-800 border-purple-200',
  'أهداف': 'bg-green-100 text-green-800 border-green-200',
  'أفكار': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'ملاحظات': 'bg-blue-100 text-blue-800 border-blue-200',
  'عام': 'bg-gray-100 text-gray-800 border-gray-200',
};
