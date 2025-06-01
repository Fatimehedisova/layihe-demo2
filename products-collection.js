const params = new URLSearchParams(window.location.search)
const category = params.get('category')
fetch('./products.json')
.then(res=>res.json())
.then(data=>{
    let collectionProduct= document.getElementById('collection-categories-product');
    collectionProduct.innerHTML=''
    let filteredProducts = data.filter(product=>product.category&&product.category.toLowerCase()===category.toLowerCase())
    filteredProducts.forEach(product=>{
        let collectionProductGrid = document.createElement('div')
        collectionProductGrid.classList.add('product-card');
        collectionProductGrid.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="cm-product-name">${product.name}</div>
        <div class="cm-products-price">${product.price}</div>
        `
        collectionProduct.appendChild(collectionProductGrid)
    })
    
})
let collectionProducts= document.querySelector('.collection-main-grid')
let gridChangeProduct = document.querySelector('.collection-grid-change')
let gridc2 = gridChangeProduct.querySelector('.grid-c2')
let gridc1 = gridChangeProduct.querySelector('.grid-c1')
gridc2.addEventListener('click',()=>{
    collectionProducts.style.gridTemplateColumns = 'repeat(3,1fr)'
})
gridc1.addEventListener('click',()=>{
     collectionProducts.style.gridTemplateColumns = 'repeat(4,1fr)'
})