import { products, findProduct } from "./products.js";
import { cart, lineTotal, cartSubtotal, shippingFor, addToCart, removeFromCart, changeQuantity, cartCount } from "./cart.js";
import { formatPrice } from "./format.js";
import { saveCart } from "./storage.js";

const productList = document.querySelector(".products");
const cartList = document.querySelector("#cart-items");
const search = document.querySelector("#search");
const saleOnly = document.querySelector("#sale-only");
const noResults = document.querySelector("#no-results");
const sortBy = document.querySelector("#sort");
const searchSummary = document.querySelector("#search-summary");
const searchTerm = document.querySelector("#search-term");
function cartLine(item) {
    const product = findProduct(item.productId);
    const line = document.createElement("li");

    const name = document.createElement("span");
    name.className = "cart-name";
    name.textContent = product.name;
    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;
    const total = document.createElement("span");
    total.textContent = formatPrice(lineTotal(item));

    const less = document.createElement("button");
    less.type = "button";
    less.className = "less";
    less.textContent = "-";
    less.dataset.id = product.id;
    less.setAttribute("aria-label", "One less " + product.name);

    const more = document.createElement("button");
    more.type = "button";
    more.className = "more";
    more.textContent = "+";
    more.dataset.id = product.id;
    more.setAttribute("aria-label", "One more " + product.name);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = "Remove";
    remove.dataset.id = product.id;

    line.append(name, less, quantity, more, total, remove);
    return line;
}

function renderCart() {
    cartList.textContent = "";
    cart.forEach(function (item) {
        cartList.append(cartLine(item));
    });
    document.querySelector("#cart-empty").hidden = cart.length > 0;
    document.querySelector("#cart-count").textContent = cartCount(cart);

    const subtotal = cartSubtotal(cart);
    const shipping = shippingFor(subtotal);
    document.querySelector("#subtotal").textContent = formatPrice(subtotal);
    document.querySelector("#total").textContent = formatPrice(subtotal + shipping);
    let shippingText = formatPrice(shipping);
    if (shipping === 0) {
        shippingText = "Free";
    }
    document.querySelector("#shipping").textContent = shippingText;
    saveCart(cart);
}

productList.addEventListener("click", function (event) {
    if (event.target.matches("button")) {
        addToCart(cart, Number(event.target.dataset.id));
        renderCart();
    }
});

function productCard(product) {
    const card = document.createElement("li");
    card.className = "card";

    if (product.onSale) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = "Sale";
        card.append(badge);
    }

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Add to cart";
    button.dataset.id = product.id;

    card.append(image, name, price, button);
    return card;
}

function renderProducts(list) {
    productList.textContent = "";
    list.forEach(function (product) {
        productList.append(productCard(product));
    });
    noResults.hidden = list.length > 0;
}

showMatches();

function matchingProducts() {
    const term = search.value.trim().toLowerCase();
    return products.filter(function (product) {
        const nameMatches = product.name.toLowerCase().includes(term);
        const saleMatches = !saleOnly.checked || product.onSale;
        return nameMatches && saleMatches;
    });
}

function sortProducts(list) {
    const sorted = list.slice();
    if (sortBy.value === "price-asc") {
        sorted.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (sortBy.value === "price-desc") {
        sorted.sort(function (a, b) {
            return b.price - a.price;
        });
    } else if (sortBy.value === "name-asc") {
        sorted.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }
    return sorted;
}

function showSearchTerm() {
    const term = search.value.trim();
    searchTerm.textContent = term;
    searchSummary.hidden = term === "";
}

function showMatches() {
    renderProducts(sortProducts(matchingProducts()));
    showSearchTerm();
}

search.addEventListener("input", showMatches);
saleOnly.addEventListener("change", showMatches);
sortBy.addEventListener("change", showMatches);
cartList.addEventListener("click", function (event) {
    const id = Number(event.target.dataset.id);
    if (event.target.matches(".remove")) {
        removeFromCart(cart, id);
    } else if (event.target.matches(".more")) {
        changeQuantity(cart, id, 1);
    } else if (event.target.matches(".less")) {
        changeQuantity(cart, id, -1);
    } else {
        return;
    }
    renderCart();
});

renderCart();
