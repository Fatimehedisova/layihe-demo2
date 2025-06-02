const params = new URLSearchParams(window.location.search)
const category = params.get('category')
// const searchQuery = localStorage.getItem('searchQuery')
let collectionProduct = document.getElementById('collection-categories-product');
let filteredProducts = []
fetch('./products.json')
    .then(res => res.json())
    .then(data => {

        collectionProduct.innerHTML = ''
        if (!category) {
            collectionProduct.innerHTML = `<p>this category is empty</p>`
            return;
        }
        filteredProducts = data.filter(product => product.category && product.category.toLowerCase() === category.toLowerCase())
        if (filteredProducts.length == 0) {
            collectionProduct.innerHTML = `<p>this category is empty</p>`
        }
        renderCollectionProducts(filteredProducts)

    });
function renderCollectionProducts(products) {
    collectionProducts.innerHTML = ''
    products.forEach(product => {
        let collectionProductGrid = document.createElement('div')
        collectionProductGrid.classList.add('product-card');
        collectionProductGrid.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="cm-product-name">${product.name}</div>
        <div class="cm-products-price">${product.price}</div>
        <div class='cm-add-icons'>
            <div class='basket-btn' data-id='${product.id}'><i class="fa-solid fa-basket-shopping" style="color: #000000;"></i></div>
            <div class='favorite-btn' data-id='${product.id}'><i class="fa-regular fa-heart" style="color: #000000;"></i></div>
            </div>
        `
        collectionProduct.appendChild(collectionProductGrid)
    })
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
}
function sortCollectionProducts(option) {
    let sorted = [...filteredProducts]
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
    renderCollectionProducts(sorted)
}
let collectionSort = document.querySelector('.collection-sort-dropdown select')
if (collectionSort) {
    collectionSort.addEventListener('change', (e) => {
        sortCollectionProducts(e.target.value)
    })
}
let collectionProducts = document.querySelector('.collection-main-grid')
let gridChangeProduct = document.querySelector('.collection-grid-change')
let gridc2 = gridChangeProduct.querySelector('.grid-c2')
let gridc1 = gridChangeProduct.querySelector('.grid-c1')
gridc2.addEventListener('click', () => {
    collectionProducts.style.gridTemplateColumns = 'repeat(3,1fr)'
})
gridc1.addEventListener('click', () => {
    collectionProducts.style.gridTemplateColumns = 'repeat(4,1fr)'
})
function addToFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let exists = favorites.find(item => item.id == id)
    if (!exists) {
        let productToAdd = filteredProducts.find(p => p.id == id)
        if (productToAdd) {
            favorites.push(productToAdd)
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
        let product = filteredProducts.find(p => p.id == id)
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
