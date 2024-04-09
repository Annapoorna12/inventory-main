const GST_RATE = 0.18; // Assuming GST rate is 18%

// Function to calculate total amount including GST
export const calculateTotalWithGST = (subtotal) => {
  const gstAmount = parseInt(subtotal) * GST_RATE;
  const totalWithGST = parseInt(subtotal) + gstAmount;
  return totalWithGST;
}