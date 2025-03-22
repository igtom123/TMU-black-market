document.addEventListener("DOMContentLoaded", function () {
  // Load cart items from session or database
  fetch("/api/cart")
    .then((response) => response.json())
    .then((cartItems) => {
      const cartItemsDiv = document.getElementById("cartItems");
      cartItems.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = `${item.name} - $${item.price}`;
        cartItemsDiv.appendChild(itemDiv);
      });
    })
    .catch((error) => console.error("Error:", error));

  document
    .getElementById("checkoutButton")
    .addEventListener("click", function () {
      // Handle checkout process
      alert("Checkout process initiated");
    });
});
