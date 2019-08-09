export function calculateTotalAmount(items, prop) {
  return items.reduce((a, b) => {
    return a + b[prop];
  }, 0);
}

export function generateOrderId(length = 15) {
  return new Array(length).join().replace(/(.|$)/g, () => ((Math.random() * 36) | 0).toString(36)).toUpperCase();
}
