import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const pages = [
    { label: "📰 استعراض المقالات", path: "/articles" },
    { label: "➕ أضف مقال جديد", path: "/create" },
    { label: "👤 الملف الشخصي", path: "/profile" },
    { label: "📬 الإشعارات", path: "/notifications" },
    { label: "🔐 تسجيل الدخول", path: "/loginpage" },
    { label: "🛡️ إدارة المستخدمين", path: "/admin/users" },
    { label: "🚨 إدارة البلاغات", path: "/admin/reports" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 py-16 flex flex-col items-center text-center">
      <h1 className="text-5xl font-bold text-blue-700 dark:text-white mb-4">
        🧠 لوحة التحكم الشاملة
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
        تحكّم بكل شيء من مكان واحد 👇
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => navigate(page.path)}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-6 py-4 shadow hover:shadow-lg hover:scale-105 transition transform text-lg font-medium flex items-center justify-center"
          >
            {page.label}
          </button>
        ))}
      </div>
    </div>
  );
}
