import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageWrapper from "./Pagewrapper";

export default function Favorites() {
  const queryClient = useQueryClient();

  // ✅ جلب المفضلات من localStorage
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => JSON.parse(localStorage.getItem("favorites")) || [],
  });

  // ✅ حذف المقال من المفضلة وتحديث الكاش
  const { mutate: removeFavorite } = useMutation({
    mutationFn: (id) => {
      const existing = JSON.parse(localStorage.getItem("favorites")) || [];
      const updated = existing.filter((article) => article.id !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updatedFavorites) => {
      queryClient.setQueryData(["favorites"], updatedFavorites);
    },
  });

  return (
    <PageWrapper>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          ⭐️ المقالات المفضلة
        </h1>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            🚫 لا يوجد مقالات مفضلة حتى الآن.
          </p>
        ) : (
          <ul className="space-y-6">
            {favorites.map((article) => (
              <li
                key={article.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300"
              >
                <div className="flex flex-col gap-2 text-gray-800">
                  <h2 className="text-2xl font-semibold text-gray-900">{article.title}</h2>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-3">
                    <span>✍️ {article.author || "أنت"}</span>
                    <span>🗂 {article.category || "غير مصنّف"}</span>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {article.excerpt || article.body?.slice(0, 150) + "..."}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <a
                      href={`/article/${article.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      👁 عرض المقال
                    </a>
                    <button
                      onClick={() => removeFavorite(article.id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                      title="إزالة من المفضلة"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
}
