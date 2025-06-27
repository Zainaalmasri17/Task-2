import useNotificationStore from "../../Store/notificationStore";

export default function Notifications() {
  const userEmail = localStorage.getItem("userEmail");
  const {
    getForUser,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const userNotifs = getForUser(userEmail);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-gray-100">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">🔔 إشعاراتك</h1>

        {userNotifs.length === 0 ? (
          <p className="text-center text-gray-500">🚫 لا توجد إشعارات حالياً.</p>
        ) : (
          <>
            <div className="flex justify-end mb-3">
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:underline text-sm"
              >
                ✅ تعليم الكل كمقروء
              </button>
            </div>

            <ul className="space-y-3">
              {userNotifs.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-4 rounded-lg border ${
                    notif.read
                      ? "border-gray-200 bg-gray-50 dark:bg-gray-700"
                      : "border-blue-500 bg-blue-50 dark:bg-blue-900"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p>{notif.message}</p>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        تحديد كمقروء
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    📅 {new Date(notif.createdAt).toLocaleString("ar-EG")}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
