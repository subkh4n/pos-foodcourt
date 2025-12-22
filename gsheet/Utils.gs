const Utils = {
  jsonResponse: function (data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
      ContentService.MimeType.JSON
    );
  },

  // Convert various Google Drive URL formats to displayable format
  convertDriveUrl: function (url) {
    if (!url) return "";

    // Already in correct format
    if (url.includes("drive.google.com/uc?export=view")) {
      return url;
    }

    // Format: https://lh3.googleusercontent.com/d/FILE_ID
    const lh3Match = url.match(
      /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/
    );
    if (lh3Match) {
      return "https://drive.google.com/uc?export=view&id=" + lh3Match[1];
    }

    // Format: https://drive.google.com/file/d/FILE_ID/view
    const driveMatch = url.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    );
    if (driveMatch) {
      return "https://drive.google.com/uc?export=view&id=" + driveMatch[1];
    }

    // Format: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
    );
    if (openMatch) {
      return "https://drive.google.com/uc?export=view&id=" + openMatch[1];
    }

    // Return original if no match (might be external URL like Unsplash)
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
