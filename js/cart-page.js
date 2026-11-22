import { findProduct } from "./products.js";
import { cart, lineTotal, cartSubtotal, shippingFor, cartCount } from "./cart.js";
import { formatPrice } from "./format.js";

const rows = document.querySelector("#cart-rows");

cart.forEach(function (item) {
    const product = findProduct(item.productId);
    const row = document.createElement("tr");
    [product.name, formatPrice(product.price), item.quantity, formatPrice(lineTotal(item))].forEach(function (text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        row.append(cell);
    });
    rows.append(row);
});

const subtotal = cartSubtotal(cart);
const shipping = shippingFor(subtotal);
let shippingText = formatPrice(shipping);
if (shipping === 0) {
    shippingText = "Free";
}
document.querySelector("#shipping").textContent = shippingText;
document.querySelector("#total").textContent = formatPrice(subtotal + shipping);
document.querySelector("#cart-count").textContent = cartCount(cart);
