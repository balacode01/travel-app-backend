const { Op, where } = require("sequelize");
const { Trip,TripMedia, TripMediaLike  } = require("../../models");

/**
 * Upload media for a trip
 */
const uploadTripMedia = async (req, res) => {
  try {
    console.log("Full req.body object:", req.body);
    console.log("Full req.params object:", req.params);

    const trip_id = req.params.trip_id; // Get trip_id from URL
    const { media } = req.body; // Expecting an array of media objects
    const userId = req.user?.id;

    console.log("Trip ID received:", trip_id);
    console.log("User ID:", userId);
    console.log("Media received:", media);

    if (!trip_id) {
      return res.status(400).json({ message: "Trip ID is required", statusCode: 400 });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found", statusCode: 401 });
    }

    if (!Array.isArray(media) || media.length === 0) {
      return res.status(400).json({ message: "Media array is required", statusCode: 400 });
    }

    // ✅ Check if the trip exists
    const trip = await Trip.findOne({ where: { id: trip_id, user_id: userId } });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized", statusCode: 404 });
    }

    // ✅ Upload multiple media files
    const tripMediaEntries = media.map((item) => ({
      trip_id,
      media_url: item.media_url,
      media_type: item.media_type,
      file_size: item.file_size,
      file_format: item.file_format,
      is_featured: item.is_featured || false,
    }));

    // Bulk insert
    const uploadedMedia = await TripMedia.bulkCreate(tripMediaEntries);

    return res.status(201).json({
      message: "Media uploaded successfully",
      statusCode: 201,
      media: uploadedMedia,
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
