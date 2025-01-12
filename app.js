const productListEl = document.getElementById("product-list");
const cartViewEl = document.getElementById("cart-view");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const totalPriceEl = document.getElementById("total-price");
const viewCartBtn = document.getElementById("view-cart-btn");
const clearCartBtn = document.getElementById("clear-cart");

let cart = [];

// Fetch products and render them
fetch("products.json")
  .then((response) => response.json())
  .then((products) => {
    renderProducts(products);
  })
  .catch((error) => console.error("Error loading products:", error));

function renderProducts(products) {
  productListEl.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${
        product.price
      })">Add to Cart</button>
      </div>
    `
    )
    .join("");
}

function addToCart(id, name, price) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  cartCountEl.textContent = cart.reduce((count, item) => count + item.quantity, 0);
  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div>
        <p>${item.name} - $${item.price} x ${item.quantity}</p>
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
    `
    )
    .join("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceEl.textContent = total.toFixed(2);
}

function updateQuantity(id, delta) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }
  }
  updateCartUI();
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCartUI();
});

viewCartBtn.addEventListener("click", () => {
  cartViewEl.classList.toggle("hidden");
});
