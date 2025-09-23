import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
  Users,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { API_ROUTER, DOCU_API_ROUTER } from "../../App";

export function PublicPostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const response = await axios.get(`${API_ROUTER}/getPublicPosts`, {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching public posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading public posts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl  mx-auto px-4 py-6 space-y-6">
      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <MessageCircle className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
          <p className="text-gray-500">
            Public feed is empty. Check back later!
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
          >
            <PostCard
              post={post}
              DOCU_API_ROUTER={DOCU_API_ROUTER}
              getStatusColor={getStatusColor}
              formatTimeAgo={formatTimeAgo}
            />
          </div>
        ))
      )}
    </div>
  );
}

export function EventComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const response = await axios.get(`${API_ROUTER}/getPublicPosts`, {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching public posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  const getFirstImage = (content, orgId) => {
    if (!content || content.length === 0) return null;
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
    ];
    const firstImage = content.find((item) =>
      imageExtensions.some((ext) => item.fileName.toLowerCase().includes(ext))
    );
    return firstImage
      ? `${DOCU_API_ROUTER}/${orgId}/${firstImage.fileName}`
      : null;
  };

  const renderContentPreview = (post, imageUrl, content) => {
    const fileUrl = `${DOCU_API_ROUTER}/${content.organizationProfile}/${content.fileName}`;

    return (
      <div className="relative h-48 bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.caption || "Post image"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <iframe
              src={fileUrl}
              title={content.fileName}
              className="w-full h-full"
              style={{ overflow: "hidden" }}
            />
          </div>
        )}
      </div>
    );
  };

  const parseTags = (tags) => {
    if (!tags || tags.length === 0) return [];
    try {
      const parsed = JSON.parse(tags[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading public posts...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-12 min-h-screen flex-wrap w-full p-4 bg-amber-100 gap-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Student Organizations
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-12 text-center backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                The public feed is empty. Be the first to share something
                amazing!
              </p>
            </div>
          </div>
        ) : (
          posts.map((post) => {
            const imageUrl = getFirstImage(
              post.content,
              post.organizationProfile?._id
            );
            const tags = parseTags(post.tags);
            const hasContent = post.caption && post.caption.trim().length > 0;
            const firstContent =
              post.content && post.content.length > 0 ? post.content[0] : null;

            return (
              <div
                key={post._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Enhanced content preview with overlay effects */}
                <div className="relative overflow-hidden">
                  {firstContent &&
                    renderContentPreview(post, imageUrl, firstContent)}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-5 space-y-4">
                  {/* Enhanced title with better typography */}
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-3 leading-snug group-hover:text-blue-700 transition-colors duration-200">
                    {hasContent ? post.caption : "Untitled Post"}
                  </h3>

                  {/* Improved tags with better spacing and colors */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Enhanced footer with better visual hierarchy */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {post.organizationProfile?.orgAcronym || "ORG"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                          {post.organizationProfile?.orgAcronym ||
                            "Organization"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {/* Add timestamp if available */}
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle hover indicator */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
