fetch('./products.json')
.then(res=>res.json())
.then(data=>{
    let productsProduct= document.getElementById('categories-product');
    productsProduct.innerHTML=''
    data.slice(4,10).map(product=>{
        let productGrid = document.createElement('div')
        productGrid.classList.add('productGrid');
        productGrid.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-name">${product.name}</div>
        <div class="products-price">${product.price}</div>
        `
        productsProduct.appendChild(productGrid)
    })
    
})

let products= document.querySelector('.products')
let gridProduct = document.querySelector('.grid-change')
let grid2 = gridProduct.querySelector('.grid-2')
let grid1 = gridProduct.querySelector('.grid-1')
grid2.addEventListener('click',()=>{
    products.style.gridTemplateColumns = 'repeat(2,1fr)'
})
grid1.addEventListener('click',()=>{
     products.style.gridTemplateColumns = 'repeat(3,1fr)'
})