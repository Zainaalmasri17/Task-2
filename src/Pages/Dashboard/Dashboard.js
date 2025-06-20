import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import usePostStore from "../../Store/Poststore";
import useTheme from "./Usetheme";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const { posts, deletePost } = usePostStore();
  const { theme, toggleTheme } = useTheme();

  const userPosts = posts.filter((post) => post.author === userEmail);

  // ✅ جلب المفضلة
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => JSON.parse(localStorage.getItem("favorites")) || [],
  });

  // ✅ جلب عدد التعليقات المرتبط بمستخدم معيّن
  const { data: commentCount = 0 } = useQuery({
    queryKey: ["comments", userEmail, posts],
    queryFn: () => {
      let total = 0;
      posts.forEach((post) => {
        const comments =
          JSON.parse(localStorage.getItem(`${userEmail}-comments-${post.id}`)) || [];
        total += comments.length;
      });
      return total;
    },
  });

  // ✅ تحليل التصنيفات للرسم البياني
  const categoryDistribution = userPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(categoryDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const colors = ["#3490dc", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">👋 مرحبًا بك في لوحة التحكم</h1>
          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            {theme === "light" ? "🌙 تفعيل الوضع الداكن" : "☀️ تفعيل الوضع الفاتح"}
          </button>
        </div>

        {/* الإحصائيات */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold text-blue-600">✍️ مقالاتك</h2>
            <p className="text-3xl mt-2">{userPosts.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold text-yellow-500">⭐️ المفضلة</h2>
            <p className="text-3xl mt-2">{favorites.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold text-green-600">💬 تعليقاتك</h2>
            <p className="text-3xl mt-2">{commentCount}</p>
          </div>
        </div>

        {/* الرسم البياني */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10">
          <h3 className="text-xl font-bold mb-4">📊 توزيع المقالات حسب التصنيف</h3>
          {chartData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              لا توجد بيانات لعرض الرسم البياني.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* كروت المقالات */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📄 مقالاتك</h2>
          {userPosts.length === 0 ? (
            <p className="text-gray-500 text-center">لا يوجد لديك مقالات.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md relative"
                >
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    🗂 التصنيف: {post.category}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    ⏰ منذ{" "}
                    {formatDistanceToNow(new Date(post.createdAt), { locale: ar })}
                  </p>

                  <a
                    href={`/edit/${post.id}`}
                    className="absolute top-3 left-3 text-blue-500 hover:text-blue-700"
                    title="تعديل المقال"
                  >
                    ✏
                  </a>

                  <button
                    onClick={() => {
                      if (window.confirm("هل أنت متأكد من حذف هذا المقال؟")) {
                        deletePost(post.id);
                      }
                    }}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
