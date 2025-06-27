import { FaHeart, FaThumbsDown } from "react-icons/fa";
import useReactionStore from "../../Store/reactionStore";

export default function ReactionButtons({ targetId, targetType, targetOwner }) {
  const user = localStorage.getItem("userEmail");

  const {
    toggleReaction,
    countReactions,
    getUserReaction,
  } = useReactionStore();

  const current = getUserReaction(user, targetId, targetType);

  const handleClick = (type) => {
    toggleReaction({ user, targetId, targetType, type, targetOwner });
  };

  return (
    <div className="flex gap-4 items-center mt-2 text-sm">
      <button
        onClick={() => handleClick("like")}
        className={`flex items-center gap-1 ${
          current === "like" ? "text-red-600 font-bold" : "text-gray-600"
        }`}
      >
        <FaHeart />
        {countReactions(targetId, targetType, "like")} إعجاب
      </button>

      <button
        onClick={() => handleClick("dislike")}
        className={`flex items-center gap-1 ${
          current === "dislike" ? "text-yellow-600 font-bold" : "text-gray-600"
        }`}
      >
        <FaThumbsDown />
        {countReactions(targetId, targetType, "dislike")} عدم إعجاب
      </button>
    </div>
  );
}