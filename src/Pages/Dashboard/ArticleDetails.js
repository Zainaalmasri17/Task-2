import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePostStore from "../../Store/Poststore";
import { useState } from "react";
import CommentThread from "./CommentThreads";
import useCommentStore from "../../Store/ComStore";
import useNotificationStore from "../../Store/notificationStore";
import ReactionButtons from "./ReactionButtons";
import useUserGuard from "../../Store/useUserGuard";
import useReportStore from "../../Store/reportStore"; // ✅ جديد

export default function ArticleDetails() {
  const { id } = useParams();
  const articleId = Number(id);
  const { posts } = usePostStore();
  const { getCommentsByArticle, addComment } = useCommentStore();
  const { addNotification } = useNotificationStore();
  const { checkAccess } = useUserGuard(); // ✅
  const { reports, addReport } = useReportStore(); // ✅

  const userEmail = localStorage.getItem("userEmail");
  const [newBody, setNewBody] = useState("");

  const localPost = posts.find((p) => p.id === articleId);

  const { data: articleData, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (localPost) {
        return {
          ...localPost,
          author: {
            name: localPost.author?.split("@")[0] || "مستخدم محلي",
            email: localPost.author || "unknown",
            company: "غير محدد",
          },
        };
      } else {
        const postRes = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const userRes = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${postRes.data.userId}`
        );

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

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newBody.trim()) return;

    if (!checkAccess(userEmail, "إضافة تعليق")) return;

    addComment({
      id: Date.now(),
      articleId,
      name: userEmail?.split("@")[0] || "مستخدم",
      email: userEmail,
      body: newBody,
      parentId: null,
      createdAt: new Date().toISOString(),
    });

    if (articleData?.author?.email && articleData.author.email !== userEmail) {
      addNotification({
        id: Date.now(),
        user: articleData.author.email,
        type: "reply",
        message: `💬 ${userEmail?.split("@")[0]} قام بالتعليق على مقالك`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    setNewBody("");
  };

  const handleReportArticle = () => {
    const alreadyReported = reports.some(
      (r) =>
        r.targetId === articleId &&
        r.targetType === "article" &&
        r.reportedBy === userEmail
    );

    if (alreadyReported) {
      alert("🚫 لقد أبلغت بالفعل عن هذا المقال.");
      return;
    }

    addReport({
      id: Date.now(),
      targetId: articleId,
      targetType: "article",
      reportedBy: userEmail,
      reason: "مقال غير مناسب",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    alert("✅ تم إرسال البلاغ للمشرف.");
  };

  const allComments = getCommentsByArticle(articleId) || [];
  const topLevelComments = allComments.filter((c) => c?.parentId === null && c?.body);

  if (isLoading) return <div className="text-center p-10">⏳ جاري تحميل المقال...</div>;
  if (error) return <div className="text-center p-10 text-red-600">⚠️ حدث خطأ أثناء تحميل المقال.</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 p-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 space-y-10">
        {/* 📰 عنوان ومحتوى المقال */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h1 className="text-4xl font-bold">📖 {articleData.title}</h1>
            {userEmail !== articleData.author.email && (
              <button
                onClick={handleReportArticle}
                className="text-red-600 text-sm hover:underline"
              >
                🚨 إبلاغ
              </button>
            )}
          </div>
          <p className="text-lg leading-relaxed">{articleData.body}</p>
          <div className="text-sm text-gray-500">
            ✍️ الكاتب: {articleData.author.name} | 🏢 الشركة: {articleData.author.company}
          </div>
        </div>

        {/* ❤️‍🔥 التفاعل على المقال */}
        <ReactionButtons
          targetId={articleId}
          targetType="article"
          targetOwner={articleData.author.email}
        />

        {/* 🧾 إضافة تعليق جديد */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">✍️ أضف تعليقك</h2>
          <form onSubmit={handleAddComment} className="space-y-4">
            <textarea
              placeholder="💬 شارك رأيك حول هذا المقال..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 dark:text-white resize-none"
              rows={3}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              ➕ إضافة التعليق
            </button>
          </form>
        </div>

        {/* 💬 قسم التعليقات */}
        <div>
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">💬 التعليقات</h2>
          {topLevelComments.length > 0 ? (
            <div className="space-y-6">
              {topLevelComments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  allComments={allComments}
                  articleId={articleId}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">🚫 لا توجد تعليقات حتى الآن.</p>
          )}
        </div>
      </div>
    </div>
  );
}
