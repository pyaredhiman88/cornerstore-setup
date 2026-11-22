// Cornerstore's products, built in 6.14. Section 7 puts this on the page.

async function loadProducts() {
    const response = await fetch("data/products.json");
    if (!response.ok) {
        throw new Error(`Could not load products: ${response.status}`);
    }
    return await response.json();
}

export const products = await loadProducts();

export function findProduct(id) {
    return products.find(product => product.id === id);
}
