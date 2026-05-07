// ---------- SELECTING IMPORTANT PAGE ELEMENTS ----------
const authModal = document.getElementById("authModal");
const authClose = document.getElementById("authClose");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authMessage = document.getElementById("authMessage");
const authTabs = document.querySelectorAll(".auth-tab");
const authTriggers = document.querySelectorAll("[data-auth-open]");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const cartShell = document.querySelector(".cart-shell");
const cartToggle = document.getElementById("cartToggle");
const cartDropdown = document.getElementById("cartDropdown");
const cartCount = document.querySelector(".cart-count");
const cartList = document.getElementById("cartList");
const cartEmpty = document.getElementById("cartEmpty");
const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

const compareList = document.getElementById("compareList");
const compareEmpty = document.getElementById("compareEmpty");
const clearCompareBtn = document.getElementById("clearCompareBtn");

const buyButtons = document.querySelectorAll(".buy-btn");
const compareButtons = document.querySelectorAll(".compare-btn");
const cards = document.querySelectorAll(".card");
const revealElements = document.querySelectorAll(".reveal, .reveal-card");


// ---------- LOCAL STORAGE KEYS ----------
const STORAGE_KEYS = {
    user: "ishaporeUser",
    cart: "ishaporeCartItems",
    compare: "ishaporeCompareItems",
    checkout: "ishaporeCheckoutItems"
};


// ---------- ADDING PRODUCT DATA TO EACH CARD ----------
cards.forEach(function (card, index) {
    const titleElement = card.querySelector("h3");
    const priceElement = card.querySelector(".price");

    const title = titleElement ? titleElement.textContent.trim() : "Item";
    const price = priceElement ? priceElement.textContent.replace("Price:", "").trim() : "Price unavailable";
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + index;

    card.dataset.itemId = id;
    card.dataset.itemTitle = title;
    card.dataset.itemPrice = price;
});


// ---------- LOCAL STORAGE HELPER FUNCTIONS ----------
function getStoredList(key) {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
        return [];
    }

    try {
        const list = JSON.parse(savedData);

        if (Array.isArray(list)) {
            return list;
        }
    } catch (error) {
        localStorage.removeItem(key);
    }

    return [];
}

function saveStoredList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

function getSavedUser() {
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (!savedUser) {
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch (error) {
        localStorage.removeItem(STORAGE_KEYS.user);
        return null;
    }
}

function saveUser(user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}


// ---------- AUTH MODAL FUNCTIONS ----------
function setAuthView(view) {
    const isLogin = view === "login";

    authTabs.forEach(function (tab) {
        const isActiveTab = tab.dataset.authTab === view;
        tab.classList.toggle("active", isActiveTab);
    });

    loginForm.classList.toggle("active", isLogin);
    signupForm.classList.toggle("active", !isLogin);

    if (isLogin) {
        authTitle.textContent = "Welcome Back";
        authSubtitle.textContent = "Log in to continue exploring the educational catalogue.";
    } else {
        authTitle.textContent = "Create Your Account";
        authSubtitle.textContent = "Join the member preview to save your shortlist and personalize the showroom.";
    }

    authMessage.textContent = "";
}

function openAuthModal(view) {
    setAuthView(view);
    authModal.classList.add("open");
    authModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeAuthModal() {
    authModal.classList.remove("open");
    authModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}


// ---------- CART AND COMPARE HELPER FUNCTIONS ----------
function openCartDropdown() {
    cartShell.classList.add("open");
}

function closeCartDropdown() {
    cartShell.classList.remove("open");
}

function toggleCartDropdown() {
    cartShell.classList.toggle("open");
}

function getItemFromCard(card) {
    return {
        id: card.dataset.itemId,
        title: card.dataset.itemTitle,
        price: card.dataset.itemPrice
    };
}

function renderUtilityList(listElement, emptyElement, items, type) {
    listElement.innerHTML = "";

    if (items.length === 0) {
        emptyElement.style.display = "block";
    } else {
        emptyElement.style.display = "none";
    }

    items.forEach(function (item) {
        const listItem = document.createElement("li");
        listItem.className = "utility-item";

        listItem.innerHTML =
            '<div class="item-meta">' +
                "<strong>" + item.title + "</strong>" +
                "<span>" + item.price + "</span>" +
            "</div>" +
            '<button class="item-remove" type="button" data-remove-type="' + type + '" data-item-id="' + item.id + '">' +
                "Remove" +
            "</button>";

        listElement.appendChild(listItem);
    });
}

function updateButtonStates(cartItems, compareItems) {
    cartCount.textContent = cartItems.length;

    buyButtons.forEach(function (button) {
        const card = button.closest(".card");
        const itemId = card.dataset.itemId;
        let itemFound = false;

        cartItems.forEach(function (item) {
            if (item.id === itemId) {
                itemFound = true;
            }
        });

        button.classList.toggle("added", itemFound);
        button.textContent = itemFound ? "Added To Cart" : "Buy Now";
    });

    compareButtons.forEach(function (button) {
        const card = button.closest(".card");
        const itemId = card.dataset.itemId;
        let itemFound = false;

        compareItems.forEach(function (item) {
            if (item.id === itemId) {
                itemFound = true;
            }
        });

        button.classList.toggle("active", itemFound);
        button.textContent = itemFound ? "Remove From Compare" : "Compare";
    });
}

function renderPanels() {
    const cartItems = getStoredList(STORAGE_KEYS.cart);
    const compareItems = getStoredList(STORAGE_KEYS.compare);

    renderUtilityList(cartList, cartEmpty, cartItems, "cart");
    renderUtilityList(compareList, compareEmpty, compareItems, "compare");
    cartCheckoutBtn.classList.toggle("disabled", cartItems.length === 0);
    updateButtonStates(cartItems, compareItems);
}


// ---------- CART FUNCTIONS ----------
function addToCart(item) {
    const cartItems = getStoredList(STORAGE_KEYS.cart);
    let alreadyAdded = false;

    cartItems.forEach(function (cartItem) {
        if (cartItem.id === item.id) {
            alreadyAdded = true;
        }
    });

    if (!alreadyAdded) {
        cartItems.push(item);
        saveStoredList(STORAGE_KEYS.cart, cartItems);
    }

    renderPanels();
    openCartDropdown();
}

function removeFromList(type, itemId) {
    const storageKey = type === "cart" ? STORAGE_KEYS.cart : STORAGE_KEYS.compare;
    const oldItems = getStoredList(storageKey);
    const newItems = [];

    oldItems.forEach(function (item) {
        if (item.id !== itemId) {
            newItems.push(item);
        }
    });

    saveStoredList(storageKey, newItems);
    renderPanels();
}


// ---------- COMPARE FUNCTIONS ----------
function toggleCompare(item) {
    const compareItems = getStoredList(STORAGE_KEYS.compare);
    let existingIndex = -1;

    compareItems.forEach(function (compareItem, index) {
        if (compareItem.id === item.id) {
            existingIndex = index;
        }
    });

    if (existingIndex >= 0) {
        compareItems.splice(existingIndex, 1);
    } else {
        compareItems.push(item);
    }

    saveStoredList(STORAGE_KEYS.compare, compareItems);
    renderPanels();
}


// ---------- MEMBER GREETING FUNCTION ----------
function updateMemberGreeting() {
    const user = getSavedUser();
    const oldPill = document.querySelector(".welcome-pill");

    if (!user) {
        if (oldPill) {
            oldPill.remove();
        }
        return;
    }

    if (oldPill) {
        oldPill.textContent = "Logged in as " + user.name;
        return;
    }

    const pill = document.createElement("div");
    pill.className = "welcome-pill";
    pill.textContent = "Logged in as " + user.name;
    document.body.appendChild(pill);
}


// ---------- AUTH BUTTON EVENTS ----------
authTriggers.forEach(function (button) {
    button.addEventListener("click", function () {
        openAuthModal(button.dataset.authOpen);
    });
});

authTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        setAuthView(tab.dataset.authTab);
    });
});

authClose.addEventListener("click", closeAuthModal);

authModal.addEventListener("click", function (event) {
    if (event.target === authModal) {
        closeAuthModal();
    }
});


// ---------- CART BUTTON EVENTS ----------
cartToggle.addEventListener("click", toggleCartDropdown);

document.addEventListener("click", function (event) {
    if (!cartShell.contains(event.target)) {
        closeCartDropdown();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeAuthModal();
        closeCartDropdown();
    }
});


// ---------- LOGIN AND SIGNUP FORM EVENTS ----------
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const savedUser = getSavedUser();

    if (!email || !password) {
        authMessage.textContent = "Please fill in both login fields.";
        return;
    }

    if (!savedUser || savedUser.email !== email) {
        authMessage.textContent = "No saved member profile found for that email. Try signing up first.";
        return;
    }

    authMessage.textContent = "Login successful. Welcome back, " + savedUser.name + ".";
    updateMemberGreeting();
    setTimeout(closeAuthModal, 900);
});

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || password.length < 6) {
        authMessage.textContent = "Enter a name, a valid email, and a password with at least 6 characters.";
        return;
    }

    saveUser({ name: name, email: email });
    authMessage.textContent = "Account created for " + name + ". You are now signed in.";
    updateMemberGreeting();
    signupForm.reset();
    setTimeout(closeAuthModal, 900);
});


// ---------- PRODUCT BUTTON EVENTS ----------
buyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".card");
        const item = getItemFromCard(card);

        addToCart(item);
        saveStoredList(STORAGE_KEYS.checkout, [item]);
        window.location.href = "checkout.html";
    });
});

compareButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".card");
        const item = getItemFromCard(card);

        toggleCompare(item);
    });
});


// ---------- REMOVE AND CLEAR BUTTON EVENTS ----------
cartList.addEventListener("click", function (event) {
    if (event.target.dataset.removeType === "cart") {
        removeFromList("cart", event.target.dataset.itemId);
    }
});

compareList.addEventListener("click", function (event) {
    if (event.target.dataset.removeType === "compare") {
        removeFromList("compare", event.target.dataset.itemId);
    }
});

clearCartBtn.addEventListener("click", function () {
    saveStoredList(STORAGE_KEYS.cart, []);
    renderPanels();
});

clearCompareBtn.addEventListener("click", function () {
    saveStoredList(STORAGE_KEYS.compare, []);
    renderPanels();
});

cartCheckoutBtn.addEventListener("click", function (event) {
    const cartItems = getStoredList(STORAGE_KEYS.cart);

    if (cartItems.length === 0) {
        event.preventDefault();
    } else {
        saveStoredList(STORAGE_KEYS.checkout, cartItems);
    }
});


// ---------- SCROLL REVEAL ANIMATION ----------
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.classList.add("in-view");
    });
}


// ---------- START THE PAGE ----------
renderPanels();
updateMemberGreeting();
