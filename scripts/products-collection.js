const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const searchQuery = localStorage.getItem('searchQuery');
let collectionProduct = document.getElementById('collection-categories-product');
let collectionProducts = document.querySelector('.collection-main-grid');
let filteredProducts = [];

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
fetch('./products.json')
    .then(res => res.json())
    .then(data => {
        collectionProduct.innerHTML = '';
        if (searchQuery) {
            filteredProducts = data.filter(product => {
                const query = searchQuery.toLowerCase();
                return (
                    product.name.toLowerCase().includes(query) || product.brand?.toLowerCase().includes(query) || product.category?.toLowerCase().includes(query)
                );
            });
            if (filteredProducts.length === 0) {
                collectionProduct.innerHTML = `<p>No results found for "${searchQuery}"</p>`;
                return;
            }
            renderCollectionProducts(filteredProducts);
            return;
        }
        if (category) {
            filteredProducts = data.filter(product =>
                product.category &&
                product.category.toLowerCase() === category.toLowerCase()
            );
            if (filteredProducts.length === 0) {
                collectionProduct.innerHTML = `<p>This category is empty</p>`;
                return;
            }
            renderCollectionProducts(filteredProducts);
        } else {
            collectionProduct.innerHTML = `<p>This category is empty</p>`;
        }
    });
function renderCollectionProducts(products) {
    collectionProducts.innerHTML = '';
    products.forEach(product => {
        let collectionProductGrid = document.createElement('div');
        collectionProductGrid.classList.add('product-card');
        collectionProductGrid.innerHTML = `
        <div class='product-cm-img'>
      <img src="${product.image}" alt="${product.name}">
      </div>
      <div class='cm-product-title'>
      <div class="cm-product-name">${product.name}</div> 
      <div class="cm-products-price">${convertPrice(product.price)}</div>
      </div>
      <div class='cm-add-icons'>
        <div class='basket-btn' data-id='${product.id}'><i class="fa-solid fa-basket-shopping" style="color: #000000;"></i></div>
        <div class='cm-add-icon'>
        <div class='favorite-btn' data-id='${product.id}'><i class="fa-regular fa-heart" style="color: #000000;"></i></div>
        <div class='compare-btn' data-id=${product.id}><i class="fa-solid fa-code-compare" style="color: #000000;"></i></div>
        </div>
      </div>
    `
        collectionProductGrid.addEventListener('click', (e) => {
            const clickedClass = e.target.className;
            if (
                clickedClass.includes('basket') ||
                clickedClass.includes('heart')
            ) {
                return;
            }
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = './detail.html';
        });
        collectionProducts.appendChild(collectionProductGrid);
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let productId = btn.getAttribute('data-id');
            addToFavorites(productId);
        });
    });
    document.querySelectorAll('.basket-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let productId = btn.getAttribute('data-id');
            addToBasket(productId);
        });
    });
}
function sortCollectionProducts(option) {
    let sorted = [...filteredProducts];
    switch (option) {
        case 'az':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'za':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'low-high':
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'high-low':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'featured':
        default:
            break;
    }
    renderCollectionProducts(sorted);
}
let collectionSort = document.querySelector('.collection-sort-dropdown select');
if (collectionSort) {
    collectionSort.addEventListener('change', (e) => {
        sortCollectionProducts(e.target.value);
    });
}
let gridChangeProduct = document.querySelector('.collection-grid-change');
let gridc2 = gridChangeProduct.querySelector('.grid-c2');
let gridc1 = gridChangeProduct.querySelector('.grid-c1');
gridc2.addEventListener('click', () => {
    collectionProducts.style.gridTemplateColumns = 'repeat(3,1fr)';
});
gridc1.addEventListener('click', () => {
    collectionProducts.style.gridTemplateColumns = 'repeat(4,1fr)';
});
function addToFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let exists = favorites.find(item => item.id == id);
    if (!exists) {
        let productToAdd = filteredProducts.find(p => p.id == id);
        if (productToAdd) {
            favorites.push(productToAdd);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            Swal.fire({
                title: 'Added to favorites!',
                icon: 'success'
            });
        }
    } else {
        Swal.fire({
            title: 'Already in favorites!',
            icon: 'info'
        });
    }
}
function addToBasket(id) {
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    let existingItem = basket.find(item => item.id == id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        let product = filteredProducts.find(p => p.id == id);
        if (product) {
            basket.push({ ...product, quantity: 1 });
        }
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    Swal.fire({
        title: 'Added successfully!',
        icon: 'success'
    });
}

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
        renderCollectionProducts(filteredProducts);
        
    });
});