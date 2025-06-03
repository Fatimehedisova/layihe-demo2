    let selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    let baseCurrency = JSON.parse(localStorage.getItem('exchangeRates')) || {};
    let baseCurrencySimvol = {
        USD: "$",
        AZN: "₼",
        RUB: "₽"
    };
document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            localStorage.setItem('searchQuery', query);
            window.location.href = './product-collection.html';
        }
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

});
document.querySelectorAll('.url-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        window.location.href = './product-collection.html?category=' + category;
    });
});

fetch("./products.json")
    .then(res => res.json())
    .then(data => {
        console.log(data);

        let products = document.getElementById("product-container");
        products.innerHTML = "";
        data.slice(0, 4).map(product => {
            let box = document.createElement('div');
            box.className = "box";
            box.dataset.price = product.price;
            box.innerHTML = `
           
            <img class="product-img" src="${product.image}" alt="${product.name}">
            <p class="box-text">${product.name}</p>
            <div class="prices">
            <span class="box-price">${product.price}${baseCurrencySimvol[selectedCurrency]}</span> 
            <span class="box-discountPrice"> ${product.discountPrice}${baseCurrencySimvol[selectedCurrency]}</span></div>
            `
            let img = box.querySelector(".product-img");
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

async function exchange() {
    const res = await fetch("https://v6.exchangerate-api.com/v6/e72f285414f4085527b4db02/latest/USD")
    const data = await res.json();
    baseCurrency = data.conversion_rates
    localStorage.setItem('exchangeRates', JSON.stringify(baseCurrency))
}
exchange();
[...document.querySelectorAll('.dropdown-menu button')].forEach(btn => {
    btn.addEventListener('click', () => {
        selectedCurrency = btn.textContent;
        localStorage.setItem('selectedCurrency', selectedCurrency);
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
        currencyFlag = false;
    })
})

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
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    let slides = document.querySelectorAll(".my-slides");
    let dots = document.querySelectorAll(".dot");

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove("active"));

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");
}
document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.addEventListener("click", () => currentSlide(index + 1));
});
document.querySelector(".prev").addEventListener("click", () => plusSlides(-1));
document.querySelector(".next").addEventListener("click", () => plusSlides(1));
// setInterval(() => {
//   plusSlides(1);
// }, 5000);
