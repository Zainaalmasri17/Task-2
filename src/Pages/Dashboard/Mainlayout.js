export default function MainLayout({ children }) {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300">
      {children}
    </div>
  );
}
