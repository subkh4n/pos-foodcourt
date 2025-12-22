const StockService = {
  log: function (productId, productName, change, action, notes) {
    const sheet = SS.getSheetByName(SH_STOCK_LOG);
    if (!sheet) return;
    sheet.appendRow([
      Utils.getTimestamp(),
      productId,
      productName,
      action,
      change,
      notes || "",
    ]);
  },

  logChange: function (productId, productName, oldStock, newStock, adjustment) {
    const sheet = SS.getSheetByName(SH_STOCK_LOG);
    if (!sheet) return;

    const action = adjustment > 0 ? "STOCK_IN" : "STOCK_OUT";
    sheet.appendRow([
      Utils.getTimestamp(),
      productId,
      productName,
      action,
      oldStock,
      newStock,
      adjustment,
      "Manual adjustment",
    ]);
  },
};
