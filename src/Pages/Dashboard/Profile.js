import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthRedirect from "./useAuthRedirect";
import PageWrapper from "./Pagewrapper";

export default function Profile() {
  useAuthRedirect();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  // ✅ جلب عدد المقالات المفضلة
  const { data: favoritesCount = 0 } = useQuery({
    queryKey: ["favoritesCount"],
    queryFn: () =>
      JSON.parse(localStorage.getItem("favorites"))?.length || 0,
  });

  // ✅ جلب عدد التعليقات الخاصة بالمستخدم
  const { data: commentsCount = 0 } = useQuery({
    queryKey: ["commentsCount", userEmail],
    queryFn: () => {
      let total = 0;
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`${userEmail}-comments-`)) {
          const stored = JSON.parse(localStorage.getItem(key)) || [];
          total += stored.length;
        }
      });
      return total;
    },
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginpage");
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="p-8 max-w-md w-full bg-white rounded-xl shadow-xl text-center text-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 mt-4">👤 الملف الشخصي</h2>
          <div className="mt-6 space-y-4">
            <p className="text-lg">
              📧 البريد الإلكتروني:{" "}
              <span className="font-semibold text-blue-600">{userEmail}</span>
            </p>
            <p className="text-lg">
              ⭐️ المقالات المفضلة:{" "}
              <span className="font-semibold text-yellow-500">{favoritesCount}</span>
            </p>
            <p className="text-lg">
              💬 التعليقات المضافة:{" "}
              <span className="font-semibold text-green-500">{commentsCount}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
