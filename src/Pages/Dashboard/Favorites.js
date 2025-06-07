import { useEffect, useState } from "react";
import useAuthRedirect from "./useAuthRedirect";


export default function Favorites() {
  useAuthRedirect(); // 🛑 Block unauthorized access
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);

    const handleRemoveFavorite = (id) => {
        const updatedFavorites = favorites.filter(article => article.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h2 className="text-4xl font-bold text-blue-700 mb-6">⭐️ المقالات المفضلة</h2>

            {favorites.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.map(article => (
                        <div key={article.id} className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center transition hover:shadow-xl">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900">{article.title}</h3>
                                <p className="text-gray-600 mt-2">{article.excerpt}</p>
                            </div>
                            <button 
                                onClick={() => handleRemoveFavorite(article.id)}
                                className="text-red-500 text-2xl hover:text-red-700 transition transform hover:scale-110"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-lg">🚫 لا توجد مقالات مفضلة بعد.</p>
            )}
        </div>
    );
}
