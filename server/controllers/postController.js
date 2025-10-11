import Post from "../models/Post.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Create new post
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let mediaUrl;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts", resource_type: "auto" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      mediaUrl = result.secure_url;
    }

    const post = await Post.create({
      content,
      mediaUrl,
      author: req.user.id,
    });

    await post.populate([
      { path: "author", select: "name profile.profilePic" },
      { path: "comments.user", select: "name profile.profilePic" },
      { path: "likes", select: "name profile.profilePic" },
    ]);

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// Get all posts
// -------------------------------
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profile.profilePic")
      .populate("comments.user", "name profile.profilePic")
      .populate("likes", "name profile.profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// Get top posts
// -------------------------------
export const getTopPosts = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const posts = await Post.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: 5 },
    ]);

    const populated = await Post.populate(posts, [
      { path: "author", select: "name profile.profilePic" },
      { path: "comments.user", select: "name profile.profilePic" },
      { path: "likes", select: "name profile.profilePic" },
    ]);

    res.json(populated);
  } catch (err) {
    console.error("Error fetching top posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// Toggle Like
// -------------------------------
export const toggleLikePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    await post.populate([
      { path: "author", select: "name profile.profilePic" },
      { path: "comments.user", select: "name profile.profilePic" },
      { path: "likes", select: "name profile.profilePic" },
    ]);

    res.json(post);
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like", error });
  }
};

// -------------------------------
// Add comment
// -------------------------------
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    await post.populate([
      { path: "author", select: "name profile.profilePic" },
      { path: "comments.user", select: "name profile.profilePic" },
      { path: "likes", select: "name profile.profilePic" },
    ]);

    res.json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error });
  }
};
