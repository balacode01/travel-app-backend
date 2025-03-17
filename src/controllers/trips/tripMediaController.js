const { TripMedia, Trip } = require("../../models");
const { Op } = require("sequelize");

/**
 * Upload media for a trip
 */
const uploadTripMedia = async (req, res) => {
  try {
    const { trip_id, media_url, media_type, file_size, file_format, is_featured } = req.body;
    const userId = req.user.id; // Get user ID from JWT middleware

    // ✅ Check if the trip exists & belongs to the user
    const trip = await Trip.findOne({
      where: { id: trip_id, user_id: userId },
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized", statusCode: 404 });
    }

    // ✅ Validate media type
    if (!["image", "video"].includes(media_type)) {
      return res.status(400).json({ message: "Invalid media type", statusCode: 400 });
    }

    // ✅ Video length validation (assuming frontend sends file duration)
    if (media_type === "video" && file_size > 30 * 1024 * 1024) { // Limit 30MB
      return res.status(400).json({ message: "Video size should be under 30MB", statusCode: 400 });
    }

    // ✅ Create media entry
    const tripMedia = await TripMedia.create({
      trip_id,
      media_url,
      media_type,
      file_size,
      file_format,
      is_featured: is_featured || false, // Default to false
    });

    return res.status(201).json({
      message: "Media uploaded successfully",
      statusCode: 201,
      media: tripMedia,
    });
  } catch (error) {
    console.error("❌ Error uploading trip media:", error);
    return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
  }
};

/**
 * Get all media for a trip
 */
const getTripMedia = async (req, res) => {
  try {
    const { trip_id } = req.params;

    // ✅ Fetch media for the trip
    const media = await TripMedia.findAll({
      where: { trip_id },
      order: [["created_at", "DESC"]],
    });

    if (!media.length) {
      return res.status(404).json({ message: "No media found for this trip", statusCode: 404 });
    }

    return res.status(200).json({ message: "Media retrieved", statusCode: 200, media });
  } catch (error) {
    console.error("❌ Error fetching trip media:", error);
    return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
  }
};

/**
 * Delete a media file (only the owner can delete)
 */
const deleteTripMedia = async (req, res) => {
  try {
    const { media_id } = req.params;
    const userId = req.user.id; // Get user ID from JWT middleware

    // ✅ Find media & ensure the user owns it
    const media = await TripMedia.findOne({
      where: { id: media_id },
      include: [{ model: Trip, where: { user_id: userId } }], // Ensure trip belongs to user
    });

    if (!media) {
      return res.status(403).json({ message: "Unauthorized or media not found", statusCode: 403 });
    }

    await media.destroy();
    return res.status(200).json({ message: "Media deleted successfully", statusCode: 200 });
  } catch (error) {
    console.error("❌ Error deleting trip media:", error);
    return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
  }
};

module.exports = { uploadTripMedia, getTripMedia, deleteTripMedia };
