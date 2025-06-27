import useUserStore from "../Store/userStore";

export default function useUserGuard() {
  const getRoleByEmail = useUserStore((s) => s.getRoleByEmail);

  const checkAccess = (email, action = "التفاعل") => {
    const role = getRoleByEmail(email);
    if (role === "banned") {
      alert(`🚫 لقد تم حظرك من ${action} في التطبيق.`);
      return false;
    }
    return true;
  };

  return { checkAccess };
}
