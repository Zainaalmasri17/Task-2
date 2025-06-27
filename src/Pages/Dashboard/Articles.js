import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import usePostStore from "../../Store/Poststore";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import ReactionButtons from "./ReactionButtons";

export default function Articles() {
  const { posts: localPosts } = usePostStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const { data: remotePosts = [], isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const postRes = await axios.get("https://jsonplaceholder.typicode.com/posts");
      const userRes = await axios.get("https://jsonplaceholder.typicode.com/users");

      const authorMap = {};
      userRes.data.forEach((u) => {
        authorMap[u.id] = u.name;
      });

      const categories = ["tech", "news", "culture", "sports"];

      return postRes.data.slice(0, 10).map((post) => {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        return {
          id: post.id,
          title: post.title,
          body: post.body,
          authorName: authorMap[post.userId] || "مجهول",
          category: categories[Math.floor(Math.random() * categories.length)], // ✅ تصنيفات متنوعة
          createdAt: date.toISOString(),
          excerpt: post.body.substring(0, 150) + "...",
        };
      });
    },
  });

  const articles = [...localPosts, ...remotePosts];

  const handleFavorite = (article) => {
    const updated = favorites.some((f) => f.id === article.id)
      ? favorites.filter((f) => f.id !== article.id)
      : [...favorites, article];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const filtered = articles.filter((article) => {
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filter === "all" || article.category === filter;
    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "alpha") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-center mb-6">📚 جميع المقالات</h1>

      {/* الفلاتر */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 ابحث عن مقال..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 p-3 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="all">كل التصنيفات</option>
          <option value="tech">تقني</option>
          <option value="news">أخبار</option>
          <option value="culture">ثقافة</option>
          <option value="sports">رياضة</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="newest">الأحدث</option>
          <option value="oldest">الأقدم</option>
          <option value="alpha">أبجديًا</option>
        </select>
      </div>

      {/* عرض المقالات */}
      {isLoading ? (
        <p className="text-center text-gray-500">⏳ جارٍ تحميل المقالات...</p>
      ) : error ? (
        <p className="text-center text-red-500">❌ حدث خطأ أثناء تحميل المقالات.</p>
      ) : sorted.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">🚫 لا توجد مقالات مطابقة.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((article) => {
            const createdDate = new Date(article.createdAt);
            const isValidDate = !isNaN(createdDate);

            return (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <Link to={`/article/${article.id}`} className="block hover:text-blue-500">
                  <h2 className="text-2xl font-semibold">{article.title}</h2>
                </Link>

                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {article.excerpt || article.body.slice(0, 150)}
                </p>

                <p className="text-sm text-blue-500 mt-3">
                  ✍️ {article.authorName || article.author || "أنت"} | 🗂 {article.category}
                </p>
                <p className="text-sm text-gray-500">
                  🕓 {isValidDate ? `منذ ${formatDistanceToNow(createdDate, { locale: ar })}` : "تاريخ غير معروف"}
                </p>

                <ReactionButtons targetId={article.id} targetType="article" />

                <button
                  onClick={() => handleFavorite(article)}
                  className={`mt-3 text-xl transition ${
                    favorites.some((f) => f.id === article.id)
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  ⭐️
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
