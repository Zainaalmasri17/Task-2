import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import usePostStore from "../../Store/Poststore";
import PageWrapper from "./Pagewrapper";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, editPost } = usePostStore();

  const existingPost = posts.find((p) => p.id === Number(id));

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("tech");

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setBody(existingPost.body);
      setCategory(existingPost.category || "tech");
    }
  }, [existingPost]);

  // ✅ mutation لتحديث المقال
  const { mutate, isPending } = useMutation({
    mutationFn: async (updatedPost) => {
      // إذا أردت استخدام API: await axios.put(`/api/posts/${updatedPost.id}`, updatedPost);
      editPost(updatedPost); // حاليًا تحديث محلي فقط
    },
    onSuccess: () => {
      alert("✅ تم تحديث المقال!");
      navigate("/dashboard");
    },
    onError: () => {
      alert("❌ فشل تحديث المقال، حاول مجددًا.");
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!title || !body) {
      alert("📝 العنوان والمحتوى مطلوبان!");
      return;
    }

    mutate({
      ...existingPost,
      title,
      body,
      category,
    });
  };

  if (!existingPost) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        ❌ لم يتم العثور على المقال المطلوب.
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-8 flex justify-center">
        <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            ✏️ تعديل المقال
          </h1>

          <form onSubmit={handleUpdate} className="space-y-4 text-gray-800">
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
              className={`w-full bg-blue-600 text-white py-3 rounded-md transition ${
                isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
              disabled={isPending}
            >
              {isPending ? "⏳ جارٍ الحفظ..." : "💾 حفظ التعديلات"}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
