fetch("./products.json")
    .then(res => res.json())
    .then(data => {
        let products = document.getElementById("product-container");
        products.innerHTML = "";
        data.forEach(product => {
            let box = document.createElement('div');
            box.className = "box";
            box.dataset.price = product.price;
            box.innerHTML = `
            <div class="percent">${product.discount}%</div>
            <img class="product-img" src="${product.image}" alt="${product.name}">
            <p class="box-text">${product.name}</p>
            <div class="prices">
             <span class="box-price">${product.price}${baseCurrencySimvol[selectedCurrency]}</span> 
            <span class="box-discountPrice"> ${product.discountPrice}${baseCurrencySimvol[selectedCurrency]}</span></div>
            `
            let img = box.querySelecprotor(".product-img");
            img.addEventListener("mouseenter", () => {
                img.src = product.hoverImage;
            })
            img.addEventListener("mouseleave", () => {
                img.src = product.image
            })
            products.appendChild(box)
        });
    });
let dropMenu = document.querySelector(".dropdown-menu");
let currencyIcon = document.querySelector(".currency-icon")
let flag = false;
let categoriesMenu = document.querySelector('.categories-menu')
let categoriesIcon = document.querySelector('.categories-icon')
categoriesIcon.addEventListener('click', () => {
    if (!flag) {
        categoriesMenu.style.display = "flex"
        categoriesIcon.classList.remove("fa-chevron-down")
        categoriesIcon.classList.add("fa-chevron-up")
        flag = true;
    }
    else {
        categoriesMenu.style.display = "none"
        categoriesIcon.classList.remove("fa-chevron-up")
        categoriesIcon.classList.add("fa-chevron-down")
        flag = false;
    }
})
currencyIcon.addEventListener("mouseover", () => {
    if (!flag) {
        dropMenu.style.display = "flex"
        currencyIcon.classList.remove("fa-chevron-down")
        currencyIcon.classList.add("fa-chevron-up")
        flag = true;
    }
    else {
        dropMenu.style.display = "none"
        currencyIcon.classList.remove("fa-chevron-up")
        currencyIcon.classList.add("fa-chevron-down")
        flag = false;
    }
})
let selectedCurrency = "USD";
let baseCurrency = {}
let baseCurrencySimvol = {
    USD: "$",
    AZN: "₼",
    RUB: "₽"
}
async function exchange() {
    const res = await fetch("https://v6.exchangerate-api.com/v6/49fd4899d730508fab0d59b2/latest/USD")
    const data = await res.json();
    baseCurrency = data.conversion_rates
}
[...document.querySelectorAll('.dropdown-menu button')].forEach(btn => {
    btn.addEventListener('click', () => {
        selectedCurrency = btn.textContent;
        document.querySelectorAll(".box").forEach(box => {
            let usd = box.dataset.price
            let newPrice = (usd * baseCurrency[selectedCurrency]).toFixed(2);
            let discountUsd = usd - (usd * parseFloat(box.querySelector('.percent').textContent) / 100);
            let newDiscountPrice = (discountUsd * baseCurrency[selectedCurrency]).toFixed(2);
            box.querySelector('.box-price').textContent = `${newPrice}${baseCurrencySimvol[selectedCurrency]} `
            box.querySelector('.box-discountPrice').textContent = `${newDiscountPrice}${baseCurrencySimvol[selectedCurrency]} `
        })
        dropMenu.style.display = "none";
        currencyIcon.classList.add("fa-chevron-down");
        currencyIcon.classList.remove("fa-chevron-up");
        flag = false;
    })
})

exchange();
const timer = () => {
    let endDate = new Date('2025-07-22T23:59:00').getTime();
    setInterval(() => {
        let now = new Date().getTime();
        let distance = endDate - now;
        let days = Math.floor(distance / (1000 * 60 * 60 * 24))
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('timer').innerHTML =
            `${days}d ${hours}h ${minutes}m ${seconds}s`
    }, 1000)
}
timer()