const loadButton = document.getElementById("loadProducts");
const output = document.getElementById("output");
const productList = document.getElementById("productList");

async function loadProducts() {
  output.style.display = "block";
  output.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  productList.innerHTML = "";

  const startTime = Date.now();
  try {
    const response = await fetch("/products?limit=400");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const delta = Date.now() - startTime;

    output.innerHTML = `<p class="mb-0">Loaded ${data.length} products in <strong>${delta}ms</strong></p>`;
    output.classList.remove("alert-info", "alert-danger");
    output.classList.add("alert-success");
    displayProducts(data);
  } catch (error) {
    output.innerHTML = `<p class="mb-0">Error: ${error.message}</p>`;
    output.classList.remove("alert-info", "alert-success");
    output.classList.add("alert-danger");
  }
}

function displayProducts(products) {
  productList.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-md-6 col-lg-4 col-xl-3 mb-4";
    productCard.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.images[0]}" class="card-img-top" alt="${
      product.title
    }" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text text-muted small">
            ${truncateText(product.description, 100)}
          </p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="badge bg-primary">$${product.price.toFixed(2)}</span>
            <button class="btn btn-sm btn-outline-primary add-to-cart" data-product-id="${
              product.id
            }">
              <i class="bi bi-cart-plus me-1"></i>Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(productCard);
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function addToCart(event) {
  const productId = event.target.closest(".add-to-cart").dataset.productId;

  console.log(`Product ${productId} added to cart`);

  showToast(`Product added to cart!`);
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className =
    "toast align-items-center text-white bg-primary border-0 position-fixed bottom-0 end-0 m-3";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  document.body.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  toast.addEventListener("hidden.bs.toast", function () {
    document.body.removeChild(toast);
  });
}

loadButton.addEventListener("click", loadProducts);
