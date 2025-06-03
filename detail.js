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
const favoriteBtn = document.querySelector('.add-btn');
const basketBtn = document.querySelector('.basket-btn');
const product = JSON.parse(localStorage.getItem('selectedProduct')) || {};
favoriteBtn.addEventListener('click', () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(item => item.id === product.id);
    if (exists) {
        Swal.fire({
            icon: 'warning',
            title: 'Already added!',
            text: 'This product is already in your favorites.'
        });
    } else {
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));

        Swal.fire({
            title: 'Added to favorites!',
            icon: 'success'
        });
    }
});

basketBtn.addEventListener('click', () => {
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    const index = basket.findIndex(item => item.id === product.id);
    if (index !== -1) {
        basket[index].quantity += 1;
    } else {
        basket.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    Swal.fire({
        title: 'Added to basket!',
        icon: 'success'
    });
});
