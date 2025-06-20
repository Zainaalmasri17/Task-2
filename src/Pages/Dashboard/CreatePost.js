import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostStore from "../../Store/Poststore";
import useAuthRedirect from "./useAuthRedirect";
import PageWrapper from "./Pagewrapper";
import { useMutation } from "@tanstack/react-query";

export default function CreatePost() {
  useAuthRedirect();
  const { addPost } = usePostStore();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("tech");

  // ✅ استخدام useMutation لإنشاء المقال
  const { mutate, isPending } = useMutation({
    mutationFn: async (newPost) => {
      // لاحقًا يمكن إرسال newPost إلى API هنا
      // await axios.post("/api/posts", newPost);
      addPost(newPost); // مؤقتًا نضيفه للتخزين المحلي
    },
    onSuccess: () => {
      alert("✅ تم نشر المقال بنجاح!");
      navigate("/articles");
    },
    onError: () => {
      alert("❌ فشل إنشاء المقال، حاول مجددًا.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !body) return alert("📌 يرجى تعبئة العنوان والمحتوى");

    mutate({
      id: Date.now(),
      title,
      body,
      category,
      author: userEmail,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex justify-center items-start p-6">
        <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            ✍️ إنشاء مقال جديد
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            <input
              type="text"
              placeholder="عنوان المقال"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900"
              disabled={isPending}
            />

            <textarea
              placeholder="نص المقال"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900"
              disabled={isPending}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900"
              disabled={isPending}
            >
              <option value="tech">تقني</option>
              <option value="news">أخبار</option>
              <option value="culture">ثقافة</option>
              <option value="sports">رياضة</option>
            </select>

            <button
              type="submit"
              className={`w-full bg-green-600 text-white py-3 rounded-md transition ${
                isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
              }`}
              disabled={isPending}
            >
              {isPending ? "⏳ جارٍ النشر..." : "➕ نشر المقال"}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
