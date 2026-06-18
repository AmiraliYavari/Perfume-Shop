import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length >= 2) {
        axios
          .get('http://localhost:3001/api/search/suggestions', { params: { q: query } })
          .then((res) => setSuggestions(res.data))
          .catch(() => {});
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // بستن پیشنهادات با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (productId) => {
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="جستجوی عطر، برند، نت..."
          className="w-full px-4 py-2 rounded-r-lg border border-gray-600 bg-dark-light text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 rounded-l-lg hover:bg-primary-dark transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-dark-light border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-200 border-b border-gray-700 last:border-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-8 h-8 object-cover rounded"
              />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}