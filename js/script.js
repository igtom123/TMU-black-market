// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Navigation Menu
    const bar = document.getElementById("bar");
    const nav = document.getElementById("navbar");
    console.log("Script loaded successfully!");
    // Toggle the mobile menu
    if (bar && nav) {
        bar.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }

    // Close the mobile menu when clicking outside of it
    document.addEventListener("click", (event) => {
        if (nav && !nav.contains(event.target) && !bar?.contains(event.target)) {
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
    const filterButtons = document.querySelectorAll(".filter-btn");
    const products = document.querySelectorAll(".pro");

    // Add click event listeners to filter buttons
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove "active" class from all buttons
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            // Add "active" class to the clicked button
            button.classList.add("active");

            const selectedCategory = button.dataset.category;

            // Filter products based on the selected category
            products.forEach((product) => {
                const productCategory = product
                    .querySelector(".des span")
                    .textContent.toLowerCase();

                if (
                    selectedCategory === "all" ||
                    productCategory === selectedCategory
                ) {
                    product.style.display = "block"; // Show matching products
                } else {
                    product.style.display = "none"; // Hide non-matching products
                }
            });
        });
    }); // Add-to-Cart Functionality
    const addToCartButtons = document.querySelectorAll(".pro a");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            // Find the closest product card
            const productCard = button.closest(".pro");

            // Extract product details
            const productName = productCard.querySelector(".des h5").textContent;
            const productPrice = productCard.querySelector(".des h4").textContent;
            const productImage = productCard.querySelector("img").src;

            // Create a product object
            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
            };

            // Save product to localStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));

            alert(`${productName} has been added to the cart.`);
        });
    });

    // Handle login functionality
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent the form from refreshing the page

            // Get form values
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            // Validate input
            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Find the user with matching email and password
            const user = users.find(
                (u) => u.email === email && u.password === password,
            );

            if (user) {
                alert(`Welcome back, ${user.name}!`);
                // Redirect to the home page or dashboard
                window.location.href = "../html/index.html";
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }
    const signupForm = document.getElementById("signup-form");

    // Handle form submission
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validate input
        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // Check if the email already exists in localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const emailExists = users.some((user) => user.email === email);

        if (emailExists) {
            alert(
                "This email is already registered. Please log in or use a different email.",
            );
            return;
        }

        // Create a new user object
        const newUser = {
            name,
            email,
            password,
        };

        // Add the new user to the users array
        users.push(newUser);

        // Save the updated users array to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        // Clear the form
        signupForm.reset();

        // Show success message
        alert("Account created successfully! You can now log in.");
    });

    function renderCart() {
        const cartItemsContainer = document.getElementById("cart-items");
        const totalPriceElement = document.getElementById("total-price");

        if (!cartItemsContainer || !totalPriceElement) {
            console.error(
                "Required elements (#cart-items or #total-price) are missing in the DOM.",
            );
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log("Cart items retrieved from localStorage:", cart);

        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            console.log(`Rendering item: ${item.name}`);
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
        console.log("Cart rendering complete. Total price:", total.toFixed(2));
    }

    // Remove Item from Cart
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.dataset.index;
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1); // Remove item from array
            localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
            renderCart(); // Re-render cart
        }
    });

    // Initial render when the cart page loads
    if (window.location.pathname.includes("../html/cart.html")) {
        renderCart();
    }

    // Search Functionality
    document.getElementById("search-button").addEventListener("click", () => {
        const query = document
            .getElementById("search-input")
            .value.trim()
            .toLowerCase();
        if (!query) {
            alert("Please enter a search term.");
            return;
        }

        // Get all products
        const products = document.querySelectorAll(".pro");

        let found = false;

        products.forEach((product) => {
            const productName = product
                .querySelector(".des h5")
                .textContent.toLowerCase();
            if (productName.includes(query)) {
                product.style.display = "block"; // Show matching products
                found = true;
            } else {
                product.style.display = "none"; // Hide non-matching products
            }
        });

        if (!found) {
            alert(`No products found for "${query}".`);
        }
    });

    // Optional: Trigger search on pressing "Enter"
    document
        .getElementById("search-input")
        .addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                document.getElementById("search-button").click();
            }
        });
});
