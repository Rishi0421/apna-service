/**
 * Construct full image URL for server-stored images
 * @param {string} relativePath - Path like /uploads/avatars/filename or /uploads/services/filename
 * @returns {string} Full URL or placeholder
 */
export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;
  
  // If it's already a full URL, return as-is
  if (relativePath.startsWith("http")) {
    return relativePath;
  }
  
  // Construct full URL
  return `http://localhost:5000${relativePath}`;
};

/**
 * Get fallback image for when image fails to load
 */
export const getFallbackImage = (type = "service") => {
  if (type === "avatar") {
    return "/default-avatar.jpg";
  }
  return "https://via.placeholder.com/300x150?text=Service+Work";
};
