// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded successfully!");

  // ==============================
  // Mobile Navigation Menu
  // ==============================
  const bar = document.getElementById("bar");
  const nav = document.getElementById("navbar");

  if (bar && nav) {
    bar.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    // Close the mobile menu when clicking outside of it
    document.addEventListener("click", (event) => {
      if (nav && !nav.contains(event.target) && !bar?.contains(event.target)) {
        nav.classList.remove("active");
      }
    });
  }

  // ==============================
  // Newsletter Subscription
  // ==============================
  const newsletterForm = document.querySelector("#newsletter .form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailInput = newsletterForm.querySelector("input[type='text']");
      const email = emailInput.value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      alert(`Thank you for subscribing with the email: ${email}`);
      emailInput.value = "";
    });
  }

  // ==============================
  // Product Filtering
  // ==============================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".pro");

  if (filterButtons.length && products.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedCategory = button.dataset.category;

        products.forEach((product) => {
          const productCategory = product
            .querySelector(".des span")
            .textContent.toLowerCase();

          if (
            selectedCategory === "all" ||
            productCategory === selectedCategory
          ) {
            product.style.display = "block";
          } else {
            product.style.display = "none";
          }
        });
      });
    });
  }

  // ==============================
  // Add-to-Cart Functionality
  // ==============================
  const addToCartButtons = document.querySelectorAll(".pro a");
  if (addToCartButtons.length) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();

        const productCard = button.closest(".pro");
        const productName = productCard.querySelector(".des h5").textContent;
        const productPrice = productCard.querySelector(".des h4").textContent;
        const productImage = productCard.querySelector("img").src;

        const product = {
          name: productName,
          price: productPrice,
          image: productImage,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const isDuplicate = cart.some((item) => item.name === productName);

        if (isDuplicate) {
          alert(`${productName} is already in the cart.`);
          return;
        }

        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`${productName} has been added to the cart.`);
      });
    });
  }

  // ==============================
  // Login and Signup Functionality
  // ==============================
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(`Welcome back!`);
          localStorage.setItem("token", data.token); // Save JWT token
          window.location.href = "../html/index.html"; // Redirect to home page
        } else {
          alert(data.message || "Invalid email or password.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  }

  // Handle Signup
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Account created successfully!");
          signupForm.reset();
        } else {
          alert(data.message || "An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  }

  // ==============================
  // Cart Rendering
  // ==============================
  function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartItemsContainer || !totalPriceElement) {
      console.error(
        "Required elements (#cart-items or #total-price) are missing.",
      );
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-info">
          <h5>${item.name}</h5>
          <h4>${item.price}</h4>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);

      total += parseFloat(item.price.replace("$", ""));
    });

    totalPriceElement.textContent = total.toFixed(2);
  }

  // Remove Item from Cart
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
      const index = event.target.dataset.index;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  // Initial render when the cart page loads
  if (window.location.pathname.includes("cart.html")) {
    renderCart();
  }

  // ==============================
  // Search Functionality
  // ==============================
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim().toLowerCase();

      if (!query) {
        alert("Please enter a search term.");
        return;
      }

      const products = document.querySelectorAll(".pro");
      let found = false;

      products.forEach((product) => {
        const productName = product
          .querySelector(".des h5")
          .textContent.toLowerCase();
        if (productName.includes(query)) {
          product.style.display = "block";
          found = true;
        } else {
          product.style.display = "none";
        }
      });

      if (!found) {
        alert(`No products found for "${query}".`);
      }
    });

    // Trigger search on pressing "Enter"
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        searchButton.click();
      }
    });
  }
});
