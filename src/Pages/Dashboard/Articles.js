import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ShowArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const postsResponse = await axios.get("https://jsonplaceholder.typicode.com/posts");
                const authorsResponse = await axios.get("https://jsonplaceholder.typicode.com/users");

                const authorsMap = {};
                authorsResponse.data.forEach(author => {
                    authorsMap[author.id] = author.name;
                });

                const mergedArticles = postsResponse.data.slice(0, 10).map(article => ({
                    ...article,
                    authorName: authorsMap[article.userId] || "Unknown",
                    excerpt: article.body.length > 150 ? article.body.substring(0, 150) + "..." : article.body
                }));

                setArticles(mergedArticles);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">📚 Blog Articles</h1>

            {/* Search Bar */}
            <input 
                type="text" 
                placeholder="🔍 ابحث عن مقال..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full p-3 mb-6 border rounded-md focus:ring-2 focus:ring-blue-500"
            />

            {/* Loading State (Skeleton Loader) */}
            {loading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-gray-300 h-32 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map(article => (
                            <Link key={article.id} to={`/article/${article.id}`} className="block no-underline">
                                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                                    <h2 className="text-2xl font-semibold text-gray-900 leading-tight">📖 {article.title}</h2>
                                    <p className="text-gray-600 mt-2">{article.excerpt} ⏳</p>
                                    <p className="text-blue-500 text-sm mt-3">✍️ By: {article.authorName}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-lg">🚫 لا توجد نتائج مطابقة للبحث.</p>
                    )}
                </div>
            )}
        </div>
    );
}
