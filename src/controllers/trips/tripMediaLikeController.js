const {Trip, TripMedia, TripMediaLikes} = require('../../models/');

/**
 * like an post(image/video)
 * unlike an post(image/video)
 * **/
const toggleTripMediaLike = async (req, res) => {
    try {
      const { media_id } = req.params;
      const userId = req.user.id; // Get user ID from JWT middleware
  
      // Check if media exists
      const media = await TripMedia.findOne({ where: { id: media_id } });
      if (!media) {
        return res.status(404).json({ message: "Media not found", statusCode: 404 });
      }
  
      // Check if the user has already liked the media
      const existingLike = await TripMediaLikes.findOne({
        where: { media_id, user_id: userId },
      });
  
      if (existingLike) {
        // Unlike if already liked
        await existingLike.destroy();
        return res.status(200).json({ message: "Media unliked successfully", statusCode: 200 });
      } else {
        // Like the media
        await TripMediaLikes.create({ media_id, user_id: userId });
        return res.status(201).json({ message: "Media liked successfully", statusCode: 201 });
      }
    } catch (error) {
      console.error("❌ Error liking trip media:", error);
      return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
    }
};
  
/**
* Get like count for a media
*/
  const getTripMediaLikes = async (req, res) => {
    try {
      const { media_id } = req.params;
  
      // Count the number of likes for the media
      const likeCount = await TripMediaLikes.count({ where: { media_id } });
  
      return res.status(200).json({ message: "Likes retrieved", statusCode: 200, likeCount });
    } catch (error) {
      console.error("❌ Error fetching trip media likes:", error);
      return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
    }
  };
  
  module.exports = {toggleTripMediaLike, getTripMediaLikes };
  
