// utils/storage.js
export function clearUserRelatedStorage() {
  const preservedKeys = ["theme"]; // احتفظ بأي مفاتيح لا تريد حذفها
  Object.keys(localStorage).forEach((key) => {
    if (!preservedKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });
}
