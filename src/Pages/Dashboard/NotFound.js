export default function NotFound() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          {/* Animated Error Icon */}
          <div className="text-red-500 text-8xl font-bold transform scale-110 hover:scale-125 transition">
              🚨 404
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mt-4">الصفحة غير موجودة</h1>
          <p className="text-lg text-gray-600 mt-2">يبدو أنك وصلت إلى رابط غير صحيح.</p>

          {/* Return Button */}
          <a 
              href="/" 
              className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md transition hover:shadow-xl active:scale-95"
          >
              🔙 العودة إلى الرئيسية
          </a>
      </div>
  );
}
