const Utils = {
  jsonResponse: function (data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
      ContentService.MimeType.JSON
    );
  },

  // Extract file ID from any Google Drive URL format
  extractFileId: function (url) {
    if (!url) return null;

    // Format: lh3.googleusercontent.com/d/FILE_ID
    const lh3Match = url.match(
      /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/
    );
    if (lh3Match) return lh3Match[1];

    // Format: drive.google.com/uc?export=view&id=FILE_ID
    const ucMatch = url.match(
      /drive\.google\.com\/uc\?export=view&id=([a-zA-Z0-9_-]+)/
    );
    if (ucMatch) return ucMatch[1];

    // Format: drive.google.com/file/d/FILE_ID/view
    const driveMatch = url.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    );
    if (driveMatch) return driveMatch[1];

    // Format: drive.google.com/open?id=FILE_ID
    const openMatch = url.match(
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
    );
    if (openMatch) return openMatch[1];

    // Format: drive.google.com/thumbnail?id=FILE_ID
    const thumbMatch = url.match(
      /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/
    );
    if (thumbMatch) return thumbMatch[1];

    return null;
  },

  // Convert various Google Drive URL formats to displayable format
  // Using lh3.googleusercontent.com which is CORS-friendly and works in browsers
  convertDriveUrl: function (url) {
    if (!url) return "";

    // Check if it's an external URL (not Google Drive)
    if (!url.includes("google") && !url.includes("drive")) {
      return url; // Return as-is for external URLs like Unsplash
    }

    // Extract file ID from any Google Drive format
    const fileId = this.extractFileId(url);
    if (fileId) {
      // Use lh3.googleusercontent.com format - best for browser display
      return "https://lh3.googleusercontent.com/d/" + fileId + "=s800";
    }

    // Already in lh3 format but without size parameter
    if (url.includes("lh3.googleusercontent.com/d/") && !url.includes("=s")) {
      return url + "=s800";
    }

    // Return original if no match
    return url;
  },

  // Get thumbnail URL for product images
  getThumbUrl: function (url, size) {
    if (!url) return "";
    const fileId = this.extractFileId(url);
    if (fileId) {
      return (
        "https://lh3.googleusercontent.com/d/" + fileId + "=s" + (size || 400)
      );
    }
    return url;
  },

  // Get or create folder for product images
  getOrCreateFolder: function (folderName) {
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      return folders.next();
    }
    return DriveApp.createFolder(folderName);
  },

  // Generate timestamp
  getTimestamp: function () {
    return Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    );
  },
};
