// ---------- SELECTING CHECKOUT PAGE ELEMENTS ----------
const checkoutList = document.getElementById("checkoutList");
const checkoutEmpty = document.getElementById("checkoutEmpty");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const checkoutReveals = document.querySelectorAll(".reveal");


// ---------- LOCAL STORAGE KEYS ----------
const CHECKOUT_KEYS = {
    checkout: "ishaporeCheckoutItems",
    cart: "ishaporeCartItems"
};


// ---------- GET ITEMS FROM LOCAL STORAGE ----------
function getCheckoutItems() {
    const savedItems = localStorage.getItem(CHECKOUT_KEYS.checkout);

    if (!savedItems) {
        return [];
    }

    try {
        const items = JSON.parse(savedItems);

        if (Array.isArray(items)) {
            return items;
        }
    } catch (error) {
        localStorage.removeItem(CHECKOUT_KEYS.checkout);
    }

    return [];
}


// ---------- CONVERT PRICE TEXT INTO A NUMBER ----------
function getPriceNumber(priceText) {
    const onlyNumbers = priceText.replace(/[^0-9.]/g, "");
    return Number(onlyNumbers) || 0;
}


// ---------- DISPLAY CHECKOUT ITEMS ----------
function renderCheckoutItems() {
    const checkoutItems = getCheckoutItems();
    let total = 0;

    checkoutList.innerHTML = "";

    if (checkoutItems.length === 0) {
        checkoutEmpty.style.display = "block";
        placeOrderBtn.disabled = true;
    } else {
        checkoutEmpty.style.display = "none";
        placeOrderBtn.disabled = false;
    }

    checkoutItems.forEach(function (item) {
        const row = document.createElement("li");
        row.className = "utility-item";

        row.innerHTML =
            '<div class="item-meta">' +
                "<strong>" + item.title + "</strong>" +
                "<span>" + item.price + "</span>" +
            "</div>";

        checkoutList.appendChild(row);
        total = total + getPriceNumber(item.price);
    });

    if (total === 0) {
        checkoutTotal.textContent = "₹0";
    } else {
        checkoutTotal.textContent = "₹" + total.toLocaleString("en-IN");
    }
}


// ---------- CHECKOUT FORM SUBMIT EVENT ----------
checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const checkoutItems = getCheckoutItems();

    if (checkoutItems.length === 0) {
        checkoutMessage.textContent = "No checkout item found. Please return to the catalogue first.";
        return;
    }

    checkoutMessage.textContent = "Demo order placed successfully. This is a front-end only checkout flow.";
    localStorage.removeItem(CHECKOUT_KEYS.checkout);
    localStorage.removeItem(CHECKOUT_KEYS.cart);
    checkoutForm.reset();
    renderCheckoutItems();
});


// ---------- SCROLL REVEAL ANIMATION ----------
if ("IntersectionObserver" in window) {
    const checkoutObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                checkoutObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    checkoutReveals.forEach(function (element) {
        checkoutObserver.observe(element);
    });
} else {
    checkoutReveals.forEach(function (element) {
        element.classList.add("in-view");
    });
}


// ---------- START THE CHECKOUT PAGE ----------
renderCheckoutItems();
