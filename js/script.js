// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Menu
  const bar = document.getElementById("bar");
  const nav = document.getElementById("navbar");

  // Toggle the mobile menu
  if (bar && nav) {
    bar.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  // Close the mobile menu when clicking outside of it
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !bar.contains(event.target)) {
      nav.classList.remove("active");
    }
  });

  // Newsletter Form Submission
  const newsletterForm = document.querySelector("#newsletter .form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission
      const emailInput = newsletterForm.querySelector("input[type='text']");
      const email = emailInput.value.trim();

      if (email) {
        alert(`Thank you for subscribing with the email: ${email}`);
        emailInput.value = ""; // Clear the input field
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }

  // Add-to-Cart Functionality
  const addToCartButtons = document.querySelectorAll(".pro a");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const product = button.parentElement;
      const productName = product.querySelector(".des h5").textContent;
      const productPrice = product.querySelector(".des h4").textContent;

      // Add product to cart (using localStorage as a temporary solution)
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ name: productName, price: productPrice });
      localStorage.setItem("cart", JSON.stringify(cart));

      alert(`${productName} has been added to the cart.`);
    });
  });
});