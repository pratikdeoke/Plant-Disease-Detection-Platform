import {
  createPostQuery,
  getPostsQuery,
  getPostByIdQuery,
  getCommentsQuery,
  addCommentQuery,
  getCommentCountQuery,
  likePostQuery,
  unlikePostQuery,
  getPostLikesCountQuery
} from "../db/discussion.queries.js";
import {pool} from "../db.js";

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    await createPostQuery(userId, title, content);

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// for like unlike
export const getPosts = async (req, res) => {
  try {
    const userId = req.user?.id || null; 

    const result = await getPostsQuery(userId);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const postResult = await getPostByIdQuery(id);
    const commentsResult = await getCommentsQuery(id);
    const countResult = await getCommentCountQuery(id);

    res.json({
      post: postResult.rows[0],
      comments: commentsResult.rows,
      total_comments: Number(countResult.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    await addCommentQuery(id, userId, content);

    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await likePostQuery(id, userId);

    res.json({ message: "Post liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like post" });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;       
    const userId = req.user.id;      

    await unlikePostQuery(id, userId);

    res.json({ message: "Post unliked" });
  } catch (err) {
    console.error("UNLIKE ERROR:", err);  
    res.status(500).json({ message: "Failed to unlike post" });
  }
};


export const toggleLike = async (req, res) => {
  const { id } = req.params; 
  const userId = req.user.id; 

  try {
    const checkLike = await pool.query(
      "SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkLike.rows.length > 0) {
      await pool.query(
        "DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2",
        [id, userId]
      );
      return res.json({ is_liked: false });
    } else {
      await pool.query(
        "INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)",
        [id, userId]
      );
      return res.json({ is_liked: true });
    }
  } catch (err) {
    console.error("LIKE TOGGLE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};