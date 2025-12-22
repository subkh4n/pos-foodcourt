
const TransactionService = {
  saveOrder: function(order) {
    const transSheet = SS.getSheetByName(SH_TRANSACTIONS);
    const detailsSheet = SS.getSheetByName(SH_TRANS_DETAILS);
    const timestamp = Utils.getTimestamp();
    
    transSheet.appendRow([
      order.id, timestamp, order.subtotal, order.tax, order.total, 
      order.cashReceived, order.cashReceived - order.total, 
      order.type, order.table, "Admin", order.paymentMethod
    ]);

    order.items.forEach((item, idx) => {
      detailsSheet.appendRow([
        order.id, idx + 1, item.id, item.name, item.quantity, 
        item.price, item.note || "", item.price * item.quantity, item.category
      ]);
      const res = ProductService.updateStock(item.id, item.quantity);
      if (res.success) {
        StockService.log(item.id, res.name, -item.quantity, "SALE", "Order " + order.id);
      }
    });
    return { status: "success" };
  }
};
