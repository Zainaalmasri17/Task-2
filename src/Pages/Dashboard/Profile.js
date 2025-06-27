import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useNotificationStore from "../../Store/notificationStore";
import useReactionStore from "../../Store/reactionStore";

import useAuthRedirect from "./useAuthRedirect";
import PageWrapper from "./Pagewrapper";
import useCommentStore from "../../Store/ComStore";

export default function Profile() {
  useAuthRedirect();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const { getForUser } = useNotificationStore();
  const userNotifications = getForUser(userEmail);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const { getLikesCountByUser } = useReactionStore();
  const { countCommentsByUser } =useCommentStore();

  const { data: likesCount = 0 } = useQuery({
    queryKey: ["likesCount", userEmail],
    queryFn: () => getLikesCountByUser(userEmail),
  });

  const { data: commentsCount = 0 } = useQuery({
    queryKey: ["commentsCount", userEmail],
    queryFn: () => countCommentsByUser(userEmail),
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginpage");
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="p-8 max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl text-center text-gray-800 dark:text-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            👤 الملف الشخصي
          </h2>

          <div className="mt-6 space-y-4">
            <p className="text-lg">
              📧 البريد الإلكتروني:{" "}
              <span className="font-semibold text-blue-600">{userEmail}</span>
            </p>
            <p className="text-lg">
              👍 عدد الإعجابات:{" "}
              <span className="font-semibold text-pink-500">{likesCount}</span>
            </p>
            <p className="text-lg">
              💬 عدد التعليقات:{" "}
              <span className="font-semibold text-green-500">{commentsCount}</span>
            </p>
            <p className="text-lg">
              🔔 إشعاراتي:{" "}
              <Link
                to="/notifications"
                className="font-semibold text-purple-600 hover:underline"
              >
                {unreadCount > 0
                  ? `(${unreadCount}) إشعارات جديدة`
                  : "لا توجد إشعارات جديدة"}
              </Link>
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
