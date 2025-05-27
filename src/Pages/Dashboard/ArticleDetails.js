import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ArticleDetails() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticleDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const postResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
                const authorResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${postResponse.data.userId}`);
                const commentsResponse = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);

                const articleData = {
                    ...postResponse.data,
                    author: {
                        name: authorResponse.data.name,
                        email: authorResponse.data.email,
                        company: authorResponse.data.company.name
                    }
                };

                setArticle(articleData);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("خطأ أثناء جلب البيانات:", error);
                setError("⚠️ فشل تحميل البيانات، حاول مجددًا.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetails();
    }, [id]);

    const handleInputChange = (e) => {
        setNewComment({ ...newComment, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.name && newComment.email && newComment.body) {
            setComments([...comments, { ...newComment, id: comments.length + 1 }]);
            setNewComment({ name: "", email: "", body: "" });
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500 text-xl font-semibold mt-6">⏳ جاري تحميل المقال...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 text-xl font-semibold mt-6">⚠️ {error}</p>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
            <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center border-b pb-3">📖 {article.title}</h1>
                <p className="text-gray-700 text-lg leading-relaxed">{article.body}</p>

                {/* معلومات الكاتب */}
                <div className="mt-6 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-400">
                    <h3 className="text-2xl font-bold text-blue-900 flex items-center">✍️ <span className="ml-2">{article.author.name}</span></h3>
                    <p className="text-blue-700 text-lg mt-2 flex items-center">📧 <span className="ml-2 font-medium">{article.author.email}</span></p>
                    <p className="text-blue-700 text-lg mt-2 flex items-center">🏢 <span className="ml-2 font-medium">{article.author.company}</span></p>
                </div>

                {/* قسم التعليقات */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">💬 التعليقات</h2>
                    {comments.length > 0 ? (
                        <div className="space-y-4 mt-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="bg-gray-100 p-5 rounded-lg shadow-md border-l-4 border-blue-500">
                                    <h4 className="font-semibold text-blue-500">{comment.name} <span className="text-gray-500">({comment.email})</span></h4>
                                    <p className="text-gray-700 mt-2">{comment.body}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-lg text-center mt-4">🚫 لا توجد تعليقات حتى الآن.</p>
                    )}
                </div>

                {/* نموذج إضافة تعليق جديد */}
                <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ إضافة تعليق جديد</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="اسمك..." 
                            value={newComment.name} 
                            onChange={handleInputChange} 
                            className="w-full p-3 border rounded-md"
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="بريدك الإلكتروني..." 
                            value={newComment.email} 
                            onChange={handleInputChange} 
                            className="w-full p-3 border rounded-md"
                        />
                        <textarea 
                            name="body" 
                            placeholder="اكتب تعليقك هنا..." 
                            value={newComment.body} 
                            onChange={handleInputChange} 
                            className="w-full p-3 border rounded-md"
                        ></textarea>
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition">
                            ➕ إضافة التعليق
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
