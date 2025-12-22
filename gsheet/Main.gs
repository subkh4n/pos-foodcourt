function doGet(e) {
  try {
    const products = ProductService.getAll();
    return Utils.jsonResponse(products);
  } catch (err) {
    return Utils.jsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const data = payload.data;

    switch (action) {
      case "ADD_PRODUCT":
        const result = ProductService.addProduct(data);
        return Utils.jsonResponse(result);

      case "UPDATE_STOCK":
        const stockResult = ProductService.updateStock(
          data.productId,
          data.adjustment
        );
        return Utils.jsonResponse(stockResult);

      case "SAVE_ORDER":
        const orderResult = TransactionService.saveOrder(data);
        return Utils.jsonResponse(orderResult);

      default:
        // Fallback for old order structure
        const fallbackResult = TransactionService.saveOrder(data || payload);
        return Utils.jsonResponse(fallbackResult);
    }
  } catch (err) {
    return Utils.jsonResponse({ status: "error", message: err.toString() });
  }
}
