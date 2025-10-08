import Profile from "../models/Profile.js";

export const likeUser = async (req, res) => {
  try {
    const { id } = req.params;           // User to be liked
    const { currentUserId } = req.body;  // Who liked

    console.log("Liking user ID:", id, "from user:", currentUserId);

    if (!currentUserId)
      return res.status(400).json({ message: "currentUserId missing" });

    if (id === currentUserId)
      return res.status(400).json({ message: "You cannot like yourself" });

    const user = await Profile.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle like
    const likedIndex = user.likes.map(String).indexOf(String(currentUserId));
    if (likedIndex !== -1) {
      user.likes.splice(likedIndex, 1);
      await user.save();
      return res.json({ message: "Like removed", likesCount: user.likes.length });
    } else {
      user.likes.push(currentUserId);
      await user.save();
      return res.json({ message: "User liked", likesCount: user.likes.length });
    }
  } catch (error) {
    console.error("Error in likeUser:", error);
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};
