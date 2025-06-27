export function toggleLike(postId, userEmail) {
  const likesByUser = JSON.parse(localStorage.getItem("likesByUser")) || {};
  const userLikes = likesByUser[userEmail] || [];

  const alreadyLiked = userLikes.includes(postId);
  const updatedLikes = alreadyLiked
    ? userLikes.filter((id) => id !== postId)
    : [...userLikes, postId];

  likesByUser[userEmail] = updatedLikes;
  localStorage.setItem("likesByUser", JSON.stringify(likesByUser));

  return !alreadyLiked; // true إذا أصبح liked، false إذا تم إزالته
}
