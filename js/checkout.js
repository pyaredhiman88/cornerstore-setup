import { cart } from "./cart.js";

const form = document.querySelector("#checkout");

function check(id, isValid, message) {
    const error = document.querySelector("#" + id + "-error");
    if (isValid) {
        error.textContent = "";
    } else {
        error.textContent = message;
    }
    return isValid;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.fullname.value.trim();
    const street = form.street.value.trim();
    const city = form.city.value.trim();
    const postcode = form.postcode.value.trim();

    const results = [
        check("fullname", name !== "", "Please enter your name."),
        check("street", street !== "", "Please enter your street address."),
        check("city", city !== "", "Please enter your city."),
        check("postcode", /^[0-9]{5}$/.test(postcode), "A postcode is five numbers, like 94105."),
        check("cart", cart.length > 0, "Your cart is empty. Add something first.")
    ];

    if (!results.includes(false)) {
        document.querySelector("#placed").hidden = false;
    }
});
