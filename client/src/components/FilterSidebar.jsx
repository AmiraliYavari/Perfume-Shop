import { useState, useEffect } from 'react';
import { fetchFilters } from '../api';

export default function FilterSidebar({ onFilterChange, currentFilters }) {
  const [filters, setFilters] = useState({ brands: [], notes: [], genders: [], concentrations: [], seasons: [] });

  useEffect(() => {
    fetchFilters().then((res) => setFilters(res.data)).catch(console.error);
  }, []);

  const handleCheckbox = (type, value) => {
    const current = currentFilters[type] || '';
    const newValue = current === value ? '' : value; // toggle like radio (single select) or multiple? We'll do single select for demo
    onFilterChange({ ...currentFilters, [type]: newValue });
  };

  const renderGroup = (title, key, items) => (
    <div className="mb-4">
      <h4 className="font-semibold mb-2 text-gray-700">{title}</h4>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={currentFilters[key] === item}
              onChange={() => handleCheckbox(key, item)}
              className="accent-amber-500"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-64 p-4 bg-gray-50 border-l h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-800">فیلترها</h2>
      {renderGroup('جنسیت', 'gender', filters.genders)}
      {renderGroup('غلظت', 'concentration', filters.concentrations)}
      {renderGroup('برند', 'brand', filters.brands)}
      {renderGroup('فصل', 'season', filters.seasons)}
      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-gray-700">نت‌های بویایی</h4>
        <div className="flex flex-wrap gap-2">
          {filters.notes.map((note) => (
            <button
              key={note}
              onClick={() => handleCheckbox('note', note)}
              className={`px-3 py-1 rounded-full text-xs border transition
                ${currentFilters.note === note ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-gray-300 hover:bg-amber-100'}`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => onFilterChange({})}
        className="w-full bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 transition"
      >
        حذف همه فیلترها
      </button>
    </aside>
  );
}