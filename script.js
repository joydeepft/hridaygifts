fetch('./data.json')
  .then(res => res.json())
  .then(data => {
    const products = data.products;
    console.log(products); // now you can loop & render products
  });



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

// ----------------- Search (basic) -----------------
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
        div.innerHTML = `<a href="/Products/${item.category}.html?id=${item.id}" style="text-decoration:none; color:inherit;">${item.name}</a>`;
        resultsContainer.appendChild(div);
      });

      if (e.key === "Enter" && filtered.length > 0) {
        const first = filtered[0];
        window.location.href = `/Products/${first.category}.html?id=${first.id}`;
      }
    }

    resultsContainer.style.display = "block";
  });
}

// ----------------- Product & Single Product -----------------
const productGrid = document.getElementById("productGrid");
const singleProduct = document.getElementById("singleProduct");
const productDetails = document.getElementById("productDetails");

function showSingleProduct(product) {
  if (!singleProduct || !productDetails) return;

  productGrid.classList.add("hidden");
  singleProduct.classList.remove("hidden");

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

  const productUrl = `${window.location.origin}/Products/${product.category}.html?id=${product.id}`;
  const whatsappLink = `https://wa.me/917005039643?text=Hello, I want to buy ${product.name}. Here is the link: ${productUrl}`;

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

  const mainImage = document.getElementById("mainImage");
  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      document.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

function renderProducts(list, category) {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  list
    .filter((p) => p.category === category)
    .forEach((p) => {
      const card = document.createElement("a");
      card.className = "a23";
      card.href = `?id=${p.id}`;

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
        history.pushState(null, "", `?id=${p.id}`);
      });

      productGrid.appendChild(card);
    });
}

// ----------------- Loader & Navigation -----------------
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id") || window.location.hash.substring(1);
}

window.addEventListener("DOMContentLoaded", () => {
  const productId = getProductIdFromUrl();

  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      showSingleProduct(product);
    }
  } else {
    renderProducts(products, category);
  }
});

window.addEventListener("popstate", () => {
  const productId = getProductIdFromUrl();

  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      showSingleProduct(product);
    }
  } else {
    singleProduct.classList.add("hidden");
    productGrid.classList.remove("hidden");
    renderProducts(products, category);
  }
});
