let baseCurrencySimvol = {
    USD: "$",
    AZN: "₼",
    RUB: "₽"
};

function convertPrice(priceUSD) {
    let selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    let exchangeRates = JSON.parse(localStorage.getItem('exchangeRates')) || {};
    let symbol = baseCurrencySimvol[selectedCurrency] || "$";
    let rate = exchangeRates[selectedCurrency] || 1;
    return `${(priceUSD * rate).toFixed(2)}${symbol}`;
}

if (!localStorage.getItem('exchangeRates')) {
    fetch("https://v6.exchangerate-api.com/v6/e72f285414f4085527b4db02/latest/USD")
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('exchangeRates', JSON.stringify(data.conversion_rates));
            location.reload();
        });
}
document.addEventListener("DOMContentLoaded", function () {
    const compareBox = document.querySelector(".compare-container");
    const compareList = JSON.parse(localStorage.getItem("compareProducts")) || [];

    if (compareList.length > 0) {
        compareBox.innerHTML = "";
        compareList.forEach(product => {
            compareBox.innerHTML += `
                <div class='compare-box'>
                    <div class="compare-img">
                        <img src="${product.image}" alt="${product.name}" class="compare-product-img">
                    </div>
                    <div class="compare-title-box">
                        <h5 class="compare-title">${product.name}</h5>
                        <p class="compare-description">${product.description || 'No description available.'}</p>
                        <p class="compare-price">${convertPrice(product.price)}</p>
                    </div>
                </div>
            `;
        });
    } else {
        compareBox.innerHTML = "<p>No products selected for comparison.</p>";
    }

    document.querySelector(".back-btn").addEventListener("click", () => {
        window.location.href = "./products.html";
    });
});
let dropMenu = document.querySelector(".dropdown-menu");
let currencyIconContainer = document.querySelector(".currency-hover");
let currencyIcon = currencyIconContainer.querySelector("i");

let currencyFlag = false;
let categoriesFlag = false;
let categoriesMenu = document.querySelector('.categories-menu')
let categoriesIcon = document.querySelector('.categories-icon')
categoriesIcon.addEventListener('click', () => {
    if (!categoriesFlag) {
        categoriesMenu.style.display = "flex"
        categoriesIcon.classList.remove("fa-chevron-down")
        categoriesIcon.classList.add("fa-chevron-up")
        categoriesFlag = true;
    }
    else {
        categoriesMenu.style.display = "none"
        categoriesIcon.classList.remove("fa-chevron-up")
        categoriesIcon.classList.add("fa-chevron-down")
        categoriesFlag = false;
    }
})
currencyIconContainer.addEventListener("click", () => {
    if (!currencyFlag) {
        dropMenu.style.display = "flex"
        currencyIcon.classList.remove("fa-chevron-down")
        currencyIcon.classList.add("fa-chevron-up")
        currencyFlag = true;
    }
    else {
        dropMenu.style.display = "none"
        currencyIcon.classList.remove("fa-chevron-up")
        currencyIcon.classList.add("fa-chevron-down")
        currencyFlag = false;
    }
})
document.querySelectorAll('.dropdown-menu .currency-option').forEach(option => {
    option.addEventListener('click', () => {
        let currency = option.getAttribute('data-currency');
        localStorage.setItem('selectedCurrency', currency);
        location.reload();
        
    });
});
