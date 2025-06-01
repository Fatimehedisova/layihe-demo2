let allProducts = []
fetch('./products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data.slice(1, 10);
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
    products.map(product => {
        let productGrid = document.createElement('div')
        productGrid.classList.add('productGrid');
        productGrid.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-name">${product.name}</div>
            <div class="products-price">${product.price}</div>
            <div class='favorite-btn' data-id='${product.id}'><i class="fa-regular fa-heart" style="color: #000000;"></i></div>
            `
        productsProduct.appendChild(productGrid)
    });
    document.querySelectorAll('.favorite-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
            let productId = btn.getAttribute('data-id')
            addToFavorites(productId)
        });
    });
}
function addToFavorites(id){
    let favorites=JSON.parse(localStorage.getItem('favorites')) || [];
    let exists = favorites.find(item=>item.id == id)
    if(!exists){
        let productToAdd = allProducts.find(p=>p.id==id)
        if(productToAdd){
            favorites.push(productToAdd)
            localStorage.setItem('favorites',JSON.stringify(favorites));
            
        }
    }else{
        alert('bu mehsul artiq var')
    }
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
grid2.addEventListener('click', () => {
    products.style.gridTemplateColumns = 'repeat(2,1fr)'
})
grid1.addEventListener('click', () => {
    products.style.gridTemplateColumns = 'repeat(3,1fr)'
})
let moreBtn = document.querySelector('.more-btn')
let moreCategories = [];
moreBtn.addEventListener('click', () => {
    let categoriesRight = document.querySelector('.categories-right')
    if (moreBtn.textContent == 'See More +') {
        for (let i = 0; i < 3; i++) {
            let newCategories = document.createElement('div')
            newCategories.className = 'categories-product-box more-category'
            newCategories.innerHTML = `<a href ="#">Keyboard </a>`;
            categoriesRight.insertBefore(newCategories, moreBtn.parentElement);
            moreCategories.push(newCategories)
        }
        moreBtn.textContent = 'See Less -'
    }
    else {
        moreCategories.forEach(box => box.remove())
        moreCategories = [];
        moreBtn.textContent = 'See More +'
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
