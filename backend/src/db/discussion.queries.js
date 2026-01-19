import {pool} from "../db.js";

export const createPostQuery = (userId, title, content) => {
  return pool.query(
    "INSERT INTO posts (user_id, title, content) VALUES ($1,$2,$3)",
    [userId, title, content]
  );
};

export const getPostsQuery = (userId) => {
  return pool.query(`
    SELECT 
      p.id, 
      p.title, 
      p.content, 
      p.created_at, 
      u.name,
      -- Count likes for this post
      (SELECT COUNT(*)::int FROM post_likes WHERE post_id = p.id) AS total_likes,
      -- Count comments for this post
      (SELECT COUNT(*)::int FROM comments WHERE post_id = p.id) AS total_comments,
      -- Check if the specific user liked it
      EXISTS (
        SELECT 1 FROM post_likes 
        WHERE post_id = p.id AND user_id = $1::uuid
      ) AS is_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `, [userId]);
};

export const getPostByIdQuery = (postId, userId) => {
  return pool.query(`
    SELECT 
      posts.id, 
      posts.title, 
      posts.content, 
      posts.created_at, -- Add this line!
      users.name,
      (SELECT COUNT(*)::int FROM post_likes WHERE post_id = posts.id) AS total_likes,
      EXISTS (
        SELECT 1 FROM post_likes 
        WHERE post_id = posts.id AND user_id = $2::uuid
      ) AS is_liked,
      (SELECT COUNT(*)::int FROM comments WHERE post_id = posts.id) AS total_comments
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.id = $1
  `, [postId, userId]);
};

export const getCommentsQuery = (postId) => {
  return pool.query(`
    SELECT comments.id, comments.content, users.name
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at ASC
  `, [postId]);
};

export const addCommentQuery = (postId, userId, content) => {
  return pool.query(
    "INSERT INTO comments (post_id, user_id, content) VALUES ($1,$2,$3)",
    [postId, userId, content]
  );
};

export const getCommentCountQuery = (postId) => {
  return pool.query(
    "SELECT COUNT(*) FROM comments WHERE post_id = $1",
    [postId]
  );
};

export const likePostQuery = (postId, userId) => {
  return pool.query(
    "INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [postId, userId]
  );
};

export const unlikePostQuery = (postId, userId) => {
  return pool.query(
    "DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2",
    [postId, userId]
  );
};

export const getPostLikesCountQuery = (postId) => {
  return pool.query(
    "SELECT COUNT(*) FROM post_likes WHERE post_id = $1",
    [postId]
  );
};