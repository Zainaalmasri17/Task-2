import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePostStore from "../../Store/Poststore";

export default function ArticleDetails() {
  const { id } = useParams();
  const articleId = Number(id);
  const { posts } = usePostStore();
  const userEmail = localStorage.getItem("userEmail");

  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem(`${userEmail}-comments-${id}`)) || []
  );
  const [newComment, setNewComment] = useState({ name: "", body: "" });

  // ✅ جلب بيانات المقال من localPost أو API
  const localPost = posts.find((p) => p.id === articleId);

  const { data: articleData, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (localPost) {
        return {
          ...localPost,
          author: {
            name: localPost.author || "مستخدم محلي",
            email: "local@post.dev",
            company: "غير محدد",
          },
        };
      } else {
        const postRes = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const userRes = await axios.get(`https://jsonplaceholder.typicode.com/users/${postRes.data.userId}`);

        return {
          ...postRes.data,
          author: {
            name: userRes.data.name,
            email: userRes.data.email,
            company: userRes.data.company.name,
          },
        };
      }
    },
  });

  // ✅ تحديث التعليقات في localStorage عند كل تعديل
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

  const handleEditComment = (commentId, updatedText) => {
    if (!updatedText) return;
    setComments(comments.map(comment =>
      comment.id === commentId ? { ...comment, body: updatedText } : comment
    ));
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  if (isLoading) return <div className="text-center p-10">⏳ جاري تحميل المقال...</div>;
  if (error) return <div className="text-center p-10 text-red-600">⚠️ حدث خطأ أثناء تحميل المقال.</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 p-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center border-b pb-3">
          📖 {articleData.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">{articleData.body}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">✍️ الكاتب: {articleData.author.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">🏢 الشركة: {articleData.author.company}</p>

        {/* قسم التعليقات */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b pb-2">💬 التعليقات</h2>
          {comments.length > 0 ? (
            <div className="space-y-4 mt-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-100 dark:bg-gray-700 p-5 rounded-lg shadow-md flex justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-blue-500">{comment.name}</h4>
                    <p className="text-gray-700 dark:text-gray-200 mt-2">{comment.body}</p>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handleEditComment(comment.id, prompt("📝 تعديل التعليق:", comment.body))
                      }
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
            <p className="text-gray-500 dark:text-gray-300 text-lg text-center mt-4">🚫 لا توجد تعليقات حتى الآن.</p>
          )}
        </div>

        {/* إضافة تعليق جديد */}
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">✍️ إضافة تعليق جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="اسمك..."
              value={newComment.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            />
            <textarea
              name="body"
              placeholder="اكتب تعليقك هنا..."
              value={newComment.body}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
            >
              ➕ إضافة التعليق
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
