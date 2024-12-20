const loadButton = document.getElementById("loadProducts");
const output = document.getElementById("output");
const productList = document.getElementById("productList");

async function loadProducts() {
  output.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  productList.innerHTML = "";

  const startTime = Date.now();
  try {
    const response = await fetch("/products?limit=400");
    const data = await response.json();
    const delta = Date.now() - startTime;

    output.innerHTML = `<p class="alert alert-success">Loaded ${data.length} products in <strong>${delta}ms</strong></p>`;
    displayProducts(data);
  } catch (error) {
    output.innerHTML = `<p class="alert alert-danger">Error: ${error.message}</p>`;
  }
}

function displayProducts(products) {
  console.log(products);
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-md-3 mb-4";
    productCard.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.images[0]}" class="card-img-top" alt="${
      product.title
    }">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text text-muted small">
            ${
              product.description.length > 100
                ? product.description.slice(0, 100) + "..."
                : product.description
            }
          </p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="badge bg-success">$${product.price.toFixed(2)}</span>
            <button class="btn btn-sm btn-outline-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(productCard);
  });
}

loadButton.addEventListener("click", loadProducts);
