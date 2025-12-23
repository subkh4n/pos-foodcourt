const ProductService = {
  getAll: function () {
    const sheet = SS.getSheetByName(SH_PRODUCTS);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    return data
      .slice(1)
      .map((row) => ({
        id: String(row[0]),
        name: String(row[1]),
        category: String(row[2]),
        price: Number(row[3]),
        stock: Number(row[4]),
        stokType: String(row[5]),
        available: String(row[6]),
        image: Utils.convertDriveUrl(String(row[7] || "")),
      }))
      .filter((p) => p.id);
  },

  addProduct: function (product) {
    const sheet = SS.getSheetByName(SH_PRODUCTS);
    if (!sheet) return { success: false, message: "Sheet not found" };

    let imageUrl = "";

    // Upload image to Google Drive if base64 is provided
    if (product.imageBlob && product.imageFileName) {
      try {
        const folder = Utils.getOrCreateFolder(DRIVE_FOLDER_NAME);

        // Determine mime type from filename
        const ext = product.imageFileName.split(".").pop().toLowerCase();
        const mimeTypes = {
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          gif: "image/gif",
          webp: "image/webp",
        };
        const mimeType = mimeTypes[ext] || "image/png";

        const blob = Utilities.newBlob(
          Utilities.base64Decode(product.imageBlob),
          mimeType,
          product.imageFileName
        );
        const file = folder.createFile(blob);
        file.setSharing(
          DriveApp.Access.ANYONE_WITH_LINK,
          DriveApp.Permission.VIEW
        );
        // Use lh3 format for better browser compatibility
        imageUrl =
          "https://lh3.googleusercontent.com/d/" + file.getId() + "=s800";
      } catch (err) {
        Logger.log("Image upload error: " + err.toString());
      }
    }

    // Generate ID if not provided
    const productId =
      product.id || "SKU-" + Math.floor(Math.random() * 90000 + 10000);

    // Determine stokType from product type
    let stokType = product.stokType || "STOK_FISIK";
    if (product.productType === "nonstock") {
      stokType = "NON_STOK";
    } else if (product.productType === "service") {
      stokType = "SERVICE";
    }

    // Append new row
    sheet.appendRow([
      productId,
      product.name,
      product.category,
      product.price,
      product.stock || 0,
      stokType,
      product.available ? "TRUE" : "FALSE",
      imageUrl,
    ]);

    return {
      success: true,
      message: "Product added successfully",
      productId: productId,
      imageUrl: imageUrl,
    };
  },

  updateStock: function (productId, adjustment) {
    const sheet = SS.getSheetByName(SH_PRODUCTS);
    if (!sheet) return { success: false, message: "Sheet not found" };

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(productId)) {
        const currentStock = Number(data[i][4]);
        const newStock = currentStock + adjustment;
        sheet.getRange(i + 1, 5).setValue(Math.max(0, newStock));

        // Log stock change
        StockService.logChange(
          productId,
          data[i][1],
          currentStock,
          newStock,
          adjustment
        );

        return { success: true, name: data[i][1], newStock: newStock };
      }
    }
    return { success: false, message: "Product not found" };
  },

  updateProduct: function (productId, updates) {
    const sheet = SS.getSheetByName(SH_PRODUCTS);
    if (!sheet) return { success: false, message: "Sheet not found" };

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(productId)) {
        if (updates.name) sheet.getRange(i + 1, 2).setValue(updates.name);
        if (updates.category)
          sheet.getRange(i + 1, 3).setValue(updates.category);
        if (updates.price) sheet.getRange(i + 1, 4).setValue(updates.price);
        if (updates.stock !== undefined)
          sheet.getRange(i + 1, 5).setValue(updates.stock);
        if (updates.available !== undefined)
          sheet
            .getRange(i + 1, 7)
            .setValue(updates.available ? "TRUE" : "FALSE");
        if (updates.image) sheet.getRange(i + 1, 8).setValue(updates.image);

        return { success: true, message: "Product updated" };
      }
    }
    return { success: false, message: "Product not found" };
  },
};
