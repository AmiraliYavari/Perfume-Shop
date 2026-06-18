export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 p-8 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">عطرخانه</h3>
          <p>فروشگاه اینترنتی عطر و ادکلن اصل. ما تجربه خریدی لذت‌بخش را برای شما فراهم می‌کنیم.</p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">دسترسی سریع</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">درباره ما</a></li>
            <li><a href="#" className="hover:text-white transition">تماس با ما</a></li>
            <li><a href="#" className="hover:text-white transition">قوانین و مقررات</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">اطلاعات تماس</h3>
          <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
          <p>ایمیل: info@atrkhane.ir</p>
        </div>
      </div>
      <div className="text-center text-xs mt-8 border-t border-gray-700 pt-4">
        © ۱۴۰۴ تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}