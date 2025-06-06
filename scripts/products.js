

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
let allProducts = []
fetch('./products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts);
    })
function sortAndRender(option) {
    if (!allProducts.length) return;
    let sorted = [...allProducts];
    switch (option) {
        case 'az':
            sorted.sort((a, b) => a.name.localeCompare(b.name))
            break;
        case 'za':
            sorted.sort((a, b) => b.name.localeCompare(a.name))
            break;
        case 'low-high':
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
            break;
        case 'high-low':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
            break;
        case 'featured':
        default:
            break;
    }
    renderProducts(sorted)
}
function renderProducts(products) {

    let productsProduct = document.getElementById('categories-product');
    productsProduct.innerHTML = ''
    if (products.length === 0) {
        let noProduct = document.createElement('div');
        noProduct.className = 'no-product';
        noProduct.textContent = 'No product found';
        productsProduct.appendChild(noProduct);
        return;
    }

    products.map(product => {
        let productGrid = document.createElement('div')
        productGrid.classList.add('productGrid');
        productGrid.innerHTML = `
        <div class='product-img'>
            <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="products-price">${convertPrice(product.price)}</div>
            <div class='add-icons'>
            <div class="add-icon">
            <div class='basket-btn' data-id='${product.id}'><i class="fa-solid fa-basket-shopping" style="color: #000000;"></i></div>
            <div class='compare-btn' data-id=${product.id}><i class="fa-solid fa-code-compare" style="color: #000000;"></i></div>
            </div>
            
           
            <div class='favorite-btn' data-id='${product.id}'><i class="fa-regular fa-heart" style="color: #000000;"></i></div>
 </div>
            `
        productGrid.addEventListener('click', (e) => {
            const clickedClass = e.target.className;

            if (
                clickedClass.includes('basket') ||
                clickedClass.includes('heart') ||
                clickedClass.includes('compare')
            ) {
                return;
            }

            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = './detail.html';
        });
        productsProduct.appendChild(productGrid)
    });
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let productId = btn.getAttribute('data-id')

            addToFavorites(productId)
        });
    });
    document.querySelectorAll('.basket-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let productId = btn.getAttribute('data-id')
            addToBasket(productId)
        })
    })
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let productId = btn.getAttribute('data-id');
            let product = allProducts.find(p => p.id == productId);
            if (!product) return;
            let compareList = JSON.parse(localStorage.getItem('compareProducts')) || [];
            let alreadyExists = compareList.some(item => item.id == productId);
            if (!alreadyExists) {
                compareList.push(product);
                localStorage.setItem('compareProducts', JSON.stringify(compareList));

                Swal.fire({
                    title: 'Added to compare!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Already in compare list!',
                    icon: 'info'
                });
            }
        });
    });

}
function addToFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let exists = favorites.find(item => item.id == id)
    if (!exists) {
        let productToAdd = allProducts.find(p => p.id == id)
        if (productToAdd) {
            favorites.push(productToAdd)
            localStorage.setItem('favorites', JSON.stringify(favorites));
            Swal.fire({
                title: 'Added to favorites!',
                icon: 'success'

            });
            let btn = document.querySelector(`.favorite-btn[data-id="${id}"] i`);
            if (btn) {
                btn.style.color = 'red';
            }
        }
    } else {
        Swal.fire({
            title: 'Already in favorites!',
            icon: 'info'

        })
    }
}
function addToBasket(id) {
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    let existingItem = basket.find(item => item.id == id)
    if (existingItem) {
        existingItem.quantity += 1;

    }
    else {
        let product = allProducts.find(p => p.id == id)
        if (product) {
            basket.push({ ...product, quantity: 1 });
        }
    }
    localStorage.setItem('basket', JSON.stringify(basket))
    Swal.fire({
        title: 'Added successfully!',
        icon: 'success'
    })
}
let sortSelect = document.querySelector(".sort-dropdown select");
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        sortAndRender(e.target.value);
    });
}
let products = document.querySelector('.products')
let gridProduct = document.querySelector('.grid-change')
let grid2 = gridProduct.querySelector('.grid-2')
let grid1 = gridProduct.querySelector('.grid-1')
let grid3 = gridProduct.querySelector('.grid-3')
grid2.addEventListener('click', () => {
    products.style.gridTemplateColumns = 'repeat(2,1fr)'
})
grid1.addEventListener('click', () => {
    products.style.gridTemplateColumns = 'repeat(3,1fr)'
})
grid3.addEventListener('click', () => {
    products.style.gridTemplateColumns = '1fr'
})
let moreBtn = document.querySelector('.more-btn')
let moreCategories = [];
moreBtn.addEventListener('click', () => {
    let categoriesRight = document.querySelector('.categories-right')
    if (moreBtn.textContent == 'See More +') {
        const moreItems = ['Computers', 'Chair'];
        moreItems.forEach(item => {
            let newCategories = document.createElement('div');
            newCategories.className = 'categories-product-box more-category';
            newCategories.innerHTML = `<a href="#">${item}</a>`;
            categoriesRight.insertBefore(newCategories, moreBtn.parentElement);
            moreCategories.push(newCategories);
        });
        moreBtn.textContent = 'See Less -';
    } else {
        moreCategories.forEach(box => box.remove());
        moreCategories = [];
        moreBtn.textContent = 'See More +';
    }
})
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
let filters = {
    price: null,
    categories: [],
    brands: []
}
let categoryFilter = document.querySelectorAll('.category-filter')
let priceInputs = document.querySelectorAll('input[name="price"]')
let brandFilter = document.querySelectorAll('.brand-filter')
let clearAllBtn = document.querySelector('.clear-all-btn')
categoryFilter.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
        filters.categories = [...categoryFilter].filter(cb => cb.checked).map(cb => cb.value)
        applyFilters();
    })
})
brandFilter.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
        filters.brands = [...brandFilter].filter(cb => cb.checked).map(cb => cb.value)
        applyFilters();
    })
})
priceInputs.forEach(radio => {
    radio.addEventListener('click', () => {
        filters.price = radio.value.trim()
        applyFilters();
    })
})
clearAllBtn.addEventListener('click', () => {
    [...categoryFilter, ...brandFilter].forEach(e => e.checked = false)
    priceInputs.forEach(e => e.checked = false)
    filters = { price: null, categories: [], brands: [] }
    renderProducts(allProducts)
})
function applyFilters() {
    let filtered = [...allProducts]
    if (filters.categories.length) {
        const selectedCategories = filters.categories.map(c => c.toLowerCase());
        filtered = filtered.filter(e => selectedCategories.includes(e.category.toLowerCase()));
    }
    if (filters.brands.length) {
        let selectedBrands = filters.brands.map(b => b.toLowerCase());
        filtered = filtered.filter(e => selectedBrands.includes(e.brand.toLowerCase()));
    }
    if (filters.price) {
        const priceStr = filters.price.trim();
        if (priceStr.includes('+')) {
            const min = parseFloat(priceStr.replace('+', ''));
            filtered = filtered.filter(e => e.price >= min);
        } else if (priceStr.includes('-')) {
            const [min, max] = priceStr.split('-').map(Number);
            filtered = filtered.filter(e => e.price >= min && e.price <= max);
        }
    }
    console.log("Aktiv qiymət filtiri:", filters.price);
    console.log("Uyğun məhsullar:", filtered.map(e => e.name + ' (' + e.price + ')'));
    renderProducts(filtered)
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
