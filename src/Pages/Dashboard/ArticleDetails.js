import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ArticleDetails() {
    const { id } = useParams();
    const userEmail = localStorage.getItem("userEmail"); // 🔹 الحصول على بريد المستخدم المسجل
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState(
        JSON.parse(localStorage.getItem(`${userEmail}-comments-${id}`)) || []
    );
    const [newComment, setNewComment] = useState({ name: "", body: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticleDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const postResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
                const authorResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${postResponse.data.userId}`);

                setArticle({
                    ...postResponse.data,
                    author: {
                        name: authorResponse.data.name,
                        email: authorResponse.data.email,
                        company: authorResponse.data.company.name
                    }
                });
            } catch (error) {
                setError("⚠️ فشل تحميل البيانات، حاول مجددًا.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetails();
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`${userEmail}-comments-${id}`, JSON.stringify(comments));
    }, [comments, id, userEmail]);

    const handleInputChange = (e) => {
        setNewComment({ ...newComment, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.name && newComment.body) {
            setComments([...comments, { id: Date.now(), ...newComment, userEmail }]);
            setNewComment({ name: "", body: "" });
        }
    };

    const handleEditComment = (id, updatedText) => {
        setComments(comments.map(comment =>
            comment.id === id ? { ...comment, body: updatedText } : comment
        ));
    };

    const handleDeleteComment = (id) => {
        setComments(comments.filter(comment => comment.id !== id));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
            <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center border-b pb-3">📖 {article?.title}</h1>
                <p className="text-gray-700 text-lg leading-relaxed">{article?.body}</p>

                {/* قسم التعليقات */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">💬 التعليقات</h2>
                    {comments.length > 0 ? (
                        <div className="space-y-4 mt-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="bg-gray-100 p-5 rounded-lg shadow-md flex justify-between">
                                    <div>
                                        <h4 className="font-semibold text-blue-500">{comment.name}</h4>
                                        <p className="text-gray-700 mt-2">{comment.body}</p>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => handleEditComment(comment.id, prompt("📝 تعديل التعليق:", comment.body))} 
                                            className="text-blue-500 hover:text-blue-700 mx-2"
                                        >
                                            ✏
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteComment(comment.id)} 
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            🗑
                                        </button>
                                    </div>
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
                        <input type="text" name="name" placeholder="اسمك..." value={newComment.name} onChange={handleInputChange} className="w-full p-3 border rounded-md"/>
                        <textarea name="body" placeholder="اكتب تعليقك هنا..." value={newComment.body} onChange={handleInputChange} className="w-full p-3 border rounded-md"></textarea>
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition">➕ إضافة التعليق</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
