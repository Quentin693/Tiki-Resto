interface Category {
  id: string;
  name: string;
}

interface GalleryFiltersProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function GalleryFilters({ categories, activeCategory, onCategoryChange }: GalleryFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-1">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 sm:px-6 py-2 rounded-full border-2 text-sm sm:text-base transition-colors ${
            activeCategory === category.id
              ? 'border-[#C4B5A2] bg-[#C4B5A2] text-black'
              : 'border-[#C4B5A2]/30 hover:border-[#C4B5A2] text-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 