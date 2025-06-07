import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "./useAuthRedirect";


export default function Profile() {
  useAuthRedirect();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    setFavoritesCount(JSON.parse(localStorage.getItem("favorites"))?.length || 0);

    let totalComments = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`${userEmail}-comments-`)) {
        const storedComments = JSON.parse(localStorage.getItem(key)) || [];
        totalComments += storedComments.length;
      }
    });
    setCommentsCount(totalComments);
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginpage");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-xl shadow-xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mt-4">👤 الملف الشخصي</h2>
        <div className="mt-6 space-y-4">
          <p className="text-lg text-gray-700">📧 البريد الإلكتروني: <span className="font-semibold text-blue-600">{userEmail}</span></p>
          <p className="text-lg text-gray-700">⭐️ المقالات المفضلة: <span className="font-semibold text-yellow-500">{favoritesCount}</span></p>
          <p className="text-lg text-gray-700">💬 التعليقات المضافة: <span className="font-semibold text-green-500">{commentsCount}</span></p>
        </div>
        <button 
          onClick={handleLogout} 
          className="mt-6 w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95"
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
