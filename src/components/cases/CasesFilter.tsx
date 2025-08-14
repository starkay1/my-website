'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  count: number;
}

interface CasesFilterProps {
  categories: Category[];
  onCategoryChange?: (category: string) => void;
}

export default function CasesFilter({ categories, onCategoryChange }: CasesFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full p-2">
            <Filter className="h-5 w-5 text-white" />
            <span className="text-white font-medium">筛选：</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}