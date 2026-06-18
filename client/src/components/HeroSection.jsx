import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const slides = [
  {
    id: 1,
    image: 'https://liliome.com/wp-content/uploads/2023/12/VS-Brand-1.jpg',
    alt: 'بنر ویژه عطر ۱',
  },
  {
    id: 2,
    image:
      'https://img.magnific.com/free-vector/perfume-glass-bottle-golden-silk-folded-fabric_33099-2052.jpg?semt=ais_hybrid&w=740&q=80',
    alt: 'بنر ویژه عطر ۲',
  },
  {
    id: 3,
    image:
      'https://img.magnific.com/free-vector/perfume-cosmetic-bottle-splashing-water-surface-banner_107791-1043.jpg?semt=ais_hybrid&w=740&q=80',
    alt: 'بنر ویژه عطر ۳',
  },
  {
    id: 4,
    image:
      'https://img.magnific.com/free-vector/perfume-bottle-black-silk-fabric_107791-1390.jpg?semt=ais_hybrid&w=740&q=80',
    alt: 'بنر ویژه عطر ۴',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleSlideClick = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/products/random');
      navigate(`/product/${res.data.id}`);
    } catch (err) {
      console.error('خطا در دریافت محصول تصادفی', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      {/* اسلایدها */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          onClick={handleSlideClick}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
      ))}

      {/* محتوای روی بنر */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
          عطر خاص خود را پیدا کنید
        </h1>
        <p className="text-sm md:text-base text-gray-200 mb-4 drop-shadow">
          مجموعه‌ای از بهترین برندهای جهانی با ضمانت اصالت
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-1.5 rounded-full text-sm font-medium transition"
        >
          خرید کنید
        </button>
      </div>

      {/* دکمه‌های چپ و راست */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 right-3 z-30 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center transition text-sm"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 left-3 z-30 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center transition text-sm"
      >
        ›
      </button>

      {/* نشانگرهای نقطه‌ای */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentSlide ? 'bg-primary scale-125' : 'bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}