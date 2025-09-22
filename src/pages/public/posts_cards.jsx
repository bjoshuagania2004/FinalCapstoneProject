import { useState } from "react";

export function StudentLeaderPosting() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [userName] = useState("Student Leader"); // Mock user name

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost,
        author: userName,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        liked: false,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked,
            }
          : post
      )
    );
  };

  const handleComment = (postId, comment) => {
    if (comment.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: Date.now(),
                    text: comment,
                    author: "You",
                    timestamp: new Date().toLocaleString(),
                  },
                ],
              }
            : post
        )
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Create Post */}
      <div className="bg-white border border-gray-300 rounded p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded resize-none"
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={!newPost.trim()}
          >
            Post
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}

        {posts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No posts yet. Create your first post!
          </div>
        )}
      </div>
    </div>
  );
}

function PostItem({ post, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    onComment(post.id, newComment);
    setNewComment("");
  };

  return (
    <div className="bg-white border border-gray-300 rounded p-4">
      {/* Post Header */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {post.author.charAt(0)}
        </div>
        <div className="ml-3">
          <div className="font-semibold">{post.author}</div>
          <div className="text-sm text-gray-500">{post.timestamp}</div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Stats */}
      {(post.likes > 0 || post.comments.length > 0) && (
        <div className="flex justify-between items-center py-2 border-b border-gray-200 mb-2">
          {post.likes > 0 && (
            <span className="text-sm text-gray-600">{post.likes} likes</span>
          )}
          {post.comments.length > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-sm text-gray-600 hover:underline"
            >
              {post.comments.length} comments
            </button>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex space-x-4 mb-3">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-100 ${
            post.liked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <span>{post.liked ? "👍" : "👍"}</span>
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-100 text-gray-600"
        >
          <span>💬</span>
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 pt-3">
          {/* Existing Comments */}
          {post.comments.map((comment) => (
            <div key={comment.id} className="mb-3">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded px-3 py-2">
                    <div className="font-semibold text-sm">
                      {comment.author}
                    </div>
                    <div>{comment.text}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {comment.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
              Y
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
