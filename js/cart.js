import { findProduct } from "./products.js";
import { loadCart } from "./storage.js";

// The cart keeps ids and quantities, never prices. Prices come from the product list.
export const cart = loadCart();

export function lineTotal(item) {
    const product = findProduct(item.productId);
    return product.price * item.quantity;
}

export function cartSubtotal(cart) {
    return cart.reduce(function (sum, item) {
        return sum + lineTotal(item);
    }, 0);
}

export function shippingFor(subtotal) {
    if (subtotal === 0 || subtotal >= 50) {
        return 0;
    }
    return 5;
}

export function addToCart(cart, productId) {
    const item = cart.find(function (item) {
        return item.productId === productId;
    });
    if (item) {
        item.quantity = item.quantity + 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }
}

export function removeFromCart(cart, productId) {
    const index = cart.findIndex(function (item) {
        return item.productId === productId;
    });
    if (index !== -1) {
        cart.splice(index, 1);
    }
}

export function changeQuantity(cart, productId, change) {
    const item = cart.find(function (item) {
        return item.productId === productId;
    });
    if (!item) {
        return;
    }
    item.quantity = item.quantity + change;
    if (item.quantity <= 0) {
        removeFromCart(cart, productId);
    }
}

export function cartCount(cart) {
    return cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);
}
