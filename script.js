// ----------------- Sidebar -----------------
function showSidebar() {
  const sidebar = document.querySelector(".main_sidebar");
  sidebar.classList.add("visible");
  document.addEventListener("click", handleOutsideClick);
}
function hideSidebar() {
  const sidebar = document.querySelector(".main_sidebar");
  sidebar.classList.remove("visible");
  document.removeEventListener("click", handleOutsideClick);
}
function handleOutsideClick(event) {
  const sidebar = document.querySelector(".main_sidebar");
  const menuButton = document.querySelector(".menu");
  if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
    hideSidebar();
  }
}

// ----------------- Search (index.html only) -----------------
const input = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

if (input && resultsContainer) {
  input.addEventListener("keyup", function (e) {
    const query = input.value.toLowerCase().trim();
    resultsContainer.innerHTML = "";

    if (query === "") {
      resultsContainer.style.display = "none";
      return;
    }

    const filtered = products.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(query)))
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML =
        "<div class='result-item'>No results found</div>";
    } else {
      filtered.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("result-item");
        div.innerHTML = `<a href="/Products/${item.category}.html#${item.id}" style="text-decoration:none; color:inherit;">${item.name}</a>`;
        resultsContainer.appendChild(div);
      });

      // 🚀 Enter key → go to first match
      if (e.key === "Enter") {
        window.location.href = `/Products/${filtered[0].category}.html#${filtered[0].id}`;
      }
    }

    resultsContainer.style.display = "block";
  });
}

// References
const productGrid = document.getElementById("productGrid");
const singleProduct = document.getElementById("singleProduct");
const productDetails = document.getElementById("productDetails");

// Show single product details
function showSingleProduct(product) {
  if (!singleProduct || !productDetails) return;

  // Hide product grid and show single product section
  productGrid.classList.add("hidden");
  singleProduct.classList.remove("hidden");

  // Support multiple images (fallback to single image if not available)
  const images = product.images || [product.image];
  let thumbnails = "";

  if (images.length > 1) {
    thumbnails = `
      <div class="thumbnails">
        ${images
          .map(
            (img) =>
              `<img src="${img}" alt="${product.name} thumbnail" class="thumb">`
          )
          .join("")}
      </div>
    `;
  }

  // ✅ Build WhatsApp link with page URL
  const productUrl =
    window.location.origin + window.location.pathname + "#" + product.id;
  const whatsappLink = `https://wa.me/917005039643?text=Hello, I want to buy ${product.name}. Here is the link: ${productUrl}`;

  // Insert product details
  productDetails.innerHTML = `
    <div class="product-page">
      <div class="product-left">
        <img id="mainImage" src="${images[0]}" alt="${product.name}">
        ${thumbnails}
      </div>
      <div class="product-right">
        <h2 class="product-title">${product.name}</h2>
        <div class="product-price">${product.price || ""}</div>
        <p class="product-desc">${product.description || ""}</p>
        <a class="btn" href="${whatsappLink}" target="_blank" rel="noopener">Buy Now</a>
      </div>
    </div>
  `;

  // Thumbnail click changes main image
  const mainImage = document.getElementById("mainImage");
  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      // Optional: highlight active thumb
      document
        .querySelectorAll(".thumb")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

// Render product grid
function renderProducts(list, category) {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  list
    .filter((p) => p.category === category)
    .forEach((p) => {
      const card = document.createElement("a");
      card.className = "a23";
      card.href = `#${p.id}`;

      // Choose first image (or fallback)
      let imgSrc =
        p.images && p.images.length > 0
          ? p.images[0]
          : p.image || "/images/placeholder.png";

      card.innerHTML = `
        <div class="box">
          <img src="${imgSrc}" alt="${p.name}">
          <div>
            <div class="title">${p.name}</div>
            <div class="price">${p.price}</div>
            <div class="desc">${p.description || ""}</div>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        e.preventDefault();
        showSingleProduct(p);
        history.pushState(null, "", `#${p.id}`);
      });

      productGrid.appendChild(card);
    });
}

// ✅ Load product automatically if URL has hash (#id)
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const product = products.find((p) => p.id === hash);
    if (product) {
      showSingleProduct(product);
    }
  }
});

// Handle back/forward navigation with hash
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const product = products.find((p) => p.id === hash);
    if (product) {
      showSingleProduct(product);
    }
  } else {
    // No hash → show grid again
    singleProduct.classList.add("hidden");
    productGrid.classList.remove("hidden");
  }
});
