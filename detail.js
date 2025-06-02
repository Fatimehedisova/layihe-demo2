document.addEventListener('DOMContentLoaded', () => {
    let detailImg = document.querySelector(".detail-left-img");
    let detailProductName = document.querySelector('.detail-product-name');
    let detailProductPrice = document.querySelector('.detail-product-price');
    let detailDescription = document.querySelector(".detail-description");
    let detailProductAbout = document.querySelector(".detail-product-about");
    const productData = localStorage.getItem('selectedProduct');
    if (productData) {
        const product = JSON.parse(productData)
        detailImg.src = product.image;
        detailProductName.textContent = product.name;
        detailProductPrice.textContent = product.price;
        detailDescription.textContent = product.description;
        detailProductAbout.innerHTML = `
            <p><b>Brand:</b> ${product.brand}</p>
            <p><b>Category:</b> ${product.category}</p>
        `;
    } else {
        window.location.href = "./products.html";
    }

})
