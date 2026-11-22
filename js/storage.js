import { findProduct } from "./products.js";

export function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function loadCart() {
    const saved = localStorage.getItem("cart");
    const items = JSON.parse(saved) || [];
    return items.filter(function (item) {
        return findProduct(item.productId) && item.quantity > 0;
    });
}
