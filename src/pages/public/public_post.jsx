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

// PostCard component for PublicPostFeed
const PostCard = ({ post, DOCU_API_ROUTER, getStatusColor, formatTimeAgo }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">
        {post.caption || "Untitled Post"}
      </h3>
      <p className="text-gray-500 text-sm">{formatTimeAgo(post.createdAt)}</p>
    </div>
  );
};

export function PublicPostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const response = await axios.get(`${API_ROUTER}/getPublicPosts`, {
          withCredentials: true,
        });
        setPosts(response.data.slice(0, 4)); // Only show first 4 posts to match layout
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

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading public posts...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header Section - Exact match to image */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            LATEST POSTS
          </h2>
          <div className="w-16 h-1 bg-orange-400 mx-auto"></div>
        </div>

        {/* Posts Grid - Exact 4-column layout */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {posts.length === 0 ? (
            <div className="col-span-4 text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No posts available</p>
            </div>
          ) : (
            posts.map((post) => {
              const imageUrl = getFirstImage(
                post.content,
                post.organizationProfile?._id
              );

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image Section - Matches the gray rectangles in design */}
                  <div className="h-40 bg-gray-200 relative overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.caption || "Post image"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerHTML =
                            '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><div class="text-gray-400 text-sm">No Image</div></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">No Image</div>
                      </div>
                    )}
                  </div>

                  {/* Footer Section - Matches the bottom gray section with circle */}
                  <div className="h-16 bg-gray-300 p-4 flex items-center">
                    <div className="flex items-center space-x-3">
                      {/* Circle avatar - matches design */}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {post.organizationProfile?.orgAcronym || "ORG"}
                        </span>
                      </div>

                      {/* Post title - truncated to fit design */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {post.caption || "Untitled Post"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* See More Button - Exact match to image styling */}
        <div className="text-center">
          <button className="px-8 py-3 border-2 border-orange-400 text-orange-400 font-semibold hover:bg-orange-400 hover:text-white transition-all duration-300 rounded-none">
            SEE MORE
          </button>
        </div>
      </div>
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
        setPosts(response.data.slice(0, 4)); // Only show first 4 posts to match layout
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
      <div className="relative h-40 bg-gray-200">
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
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-sm">No Image</div>
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
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading public posts...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header Section - Changed from "News and Updates" to match image */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            LATEST POSTS AND UPDATE
          </h2>
          <div className="w-16 h-1 bg-orange-400 mx-auto"></div>
        </div>

        {/* Posts Grid - Exact 4-column layout matching the image */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {posts.length === 0 ? (
            <div className="col-span-4 text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No posts available</p>
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
                post.content && post.content.length > 0
                  ? post.content[0]
                  : null;

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image Section - Matches the gray rectangles in design */}
                  <div className="relative overflow-hidden">
                    {firstContent ? (
                      renderContentPreview(post, imageUrl, firstContent)
                    ) : (
                      <div className="h-40 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">No Content</div>
                      </div>
                    )}
                  </div>

                  {/* Footer Section - Matches the bottom gray section with circle */}
                  <div className="h-16 bg-gray-300 p-4 flex items-center">
                    <div className="flex items-center space-x-3">
                      {/* Circle avatar - matches design */}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {post.organizationProfile?.orgAcronym || "ORG"}
                        </span>
                      </div>

                      {/* Post title - truncated to fit design */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {hasContent ? post.caption : "Untitled Post"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* See More Button - Exact match to image styling */}
        <div className="text-center">
          <button className="px-8 py-3 border-2 border-orange-400 text-orange-400 font-semibold hover:bg-orange-400 hover:text-white transition-all duration-300 rounded-none">
            SEE MORE
          </button>
        </div>
      </div>
    </div>
  );
}
