import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  FileText,
  Images,
  Calendar,
  Plus,
} from "lucide-react";

import { StudentLeaderAddPost } from "./add-post";
import { API_ROUTER } from "../../../../App";
import axios from "axios";

export function StudentPost({ orgData }) {
  const [posts, setPosts] = useState([]);
  const [addNewPost, setAddNewPost] = useState("");
  // Fetch accreditation data when organization profile ID changes
  useEffect(() => {
    const fetchPublicPost = async () => {
      if (!orgData._id) return;

      try {
        const response = await axios.get(
          `${API_ROUTER}/getOrgProfilePosts/${orgData._id}`,
          { withCredentials: true }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching accreditation info:", error);
      }
    };

    fetchPublicPost();
  }, [orgData._id]);

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Profile Card */}
      <div className="mx-48 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-6 p-6bg-white  shadow-md rounded-2xl max-w-md mx-auto">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              AJ
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Alex Johnson
            </h2>
            <p className="text-gray-600 mb-3 text-sm">
              Computer Science Student
            </p>

            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <span>Stanford University</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-48 px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Info */}
        <div className="space-y-4">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">About</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span>Software Engineering Intern at TechCorp</span>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <span>Studies Computer Science at Stanford University</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>Lives in San Francisco, California</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-500" />
                <span>1,247 friends</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Joined March 2020</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create Post */}
          <div
            onClick={() => setAddNewPost(true)}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center gap-4 hover:shadow-lg transition"
          >
            <div className="w-full h-full border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-300 p-6 flex flex-col gap-4 items-center justify-center rounded-lg cursor-pointer">
              <div className="p-4 w-fit bg-blue-100 rounded-full">
                <Plus size={32} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Add Post</h2>
              <p className="text-sm text-gray-500">
                Click to upload document or photos
              </p>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      AJ
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {post.author}
                      </h3>
                      <p className="text-sm text-gray-500">{post.time}</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-900">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="relative">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {addNewPost && (
        <StudentLeaderAddPost
          orgData={orgData}
          Modal={() => setAddNewPost(false)}
        />
      )}
    </div>
  );
}
