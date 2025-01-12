const productListEl = document.getElementById("product-list");
const cartViewEl = document.getElementById("cart-view");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const subtotalPriceEl = document.getElementById("subtotal-price");
const discountAmountEl = document.getElementById("discount-amount");
const totalPriceEl = document.getElementById("total-price");
const clearCartBtn = document.getElementById("clear-cart");

const promoCodes = {
  ostad10: 0.1, // 10% discount
  ostad5: 0.05, // 5% discount
};

let cart = [];
let currentPromoCode = null; // Applied promo code
let discountAmount = 0;

// Fetch products and render them
fetch("products.json")
  .then((response) => response.json())
  .then((products) => renderProducts(products))
  .catch((error) => console.error("Error loading products:", error));

function renderProducts(products) {
  productListEl.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: BDT ${product.price.toFixed(2)}</p>
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
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  discountAmount = currentPromoCode ? subtotal * promoCodes[currentPromoCode] : 0;
  const total = subtotal - discountAmount;

  // Update UI
  cartCountEl.textContent = cart.reduce((count, item) => count + item.quantity, 0);
  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div>
        <p>${item.name} - BDT ${item.price} x ${item.quantity}</p>
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
    `
    )
    .join("");

  subtotalPriceEl.textContent = subtotal.toFixed(2);
  discountAmountEl.textContent = discountAmount.toFixed(2);
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

function applyPromoCode() {
  const promoInput = document.getElementById("promo-code");
  const promoMessageEl = document.getElementById("promo-message");
  const promoCode = promoInput.value.trim().toLowerCase();

  if (promoCodes[promoCode]) {
    if (currentPromoCode === promoCode) {
      promoMessageEl.textContent = "Promo code already applied!";
    } else {
      currentPromoCode = promoCode;
      promoMessageEl.textContent = `Promo code applied! You get a ${
        promoCodes[promoCode] * 100
      }% discount.`;
      promoMessageEl.style.color = "green";
    }
  } else {
    promoMessageEl.textContent = "Invalid promo code!";
    promoMessageEl.style.color = "red";
  }

  updateCartUI();
}

document.getElementById("apply-promo").addEventListener("click", applyPromoCode);

clearCartBtn.addEventListener("click", () => {
  cart = [];
  currentPromoCode = null;
  document.getElementById("promo-message").textContent = "";
  updateCartUI();
});
