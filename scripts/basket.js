document.addEventListener('DOMContentLoaded', () => {
    let basketContainer = document.querySelector('.basket-products');
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    basketContainer.innerHTML = '';
    if (basket.length === 0) {
        basketContainer.innerHTML = '<p>Basket is empty.</p>';
        return;
    }
    basket.forEach(product => {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'basket-items';
        itemDiv.innerHTML = `
            <div class="basket-left-side">
                <button class="delete-basket"><i class="fa-solid fa-ban" style="color: #000000;"></i></button>
                <div class="basket-img">
                    <img src="${product.image}" alt="${product.name}" class="basket-product-img">
                </div>
                <div class="basket-about">
                    <h5 class="basket-name">${product.name}</h5>
                    <div class="basket-bottom">
                        <div class="quantity">
                            <button class="decrease">-</button>
                            <span class="basket-price">${product.quantity}</span>
                            <button class="increase">+</button>
                        </div>
                        <div class="basket-total-price"><span>Total: ${(product.price * product.quantity).toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
            <div class="basket-right-side">
                <button class="buyNowBtn">Buy Now</button>
            </div>
        `;
        basketContainer.appendChild(itemDiv);
        const decreaseBtn = itemDiv.querySelector('.decrease');
        const increaseBtn = itemDiv.querySelector('.increase');
        const quantitySpan = itemDiv.querySelector('.basket-price');
        const totalSpan = itemDiv.querySelector('.basket-total-price span');
        decreaseBtn.addEventListener('click', () => {
            if (product.quantity > 1) {
                product.quantity -= 1;
                quantitySpan.textContent = product.quantity;
                totalSpan.textContent = `Total: ${(product.price * product.quantity).toFixed(2)}`;
                localStorage.setItem('basket', JSON.stringify(basket));
            }
        });
        increaseBtn.addEventListener('click', () => {
            product.quantity += 1;
            quantitySpan.textContent = product.quantity;
            totalSpan.textContent = `Total: ${(product.price * product.quantity).toFixed(2)}`;
            localStorage.setItem('basket', JSON.stringify(basket));
        });
        const deleteBtn = itemDiv.querySelector('.delete-basket');
        deleteBtn.addEventListener('click', () => {
            basket = basket.filter(p => p.id !== product.id);
            localStorage.setItem('basket', JSON.stringify(basket));
            itemDiv.remove();
            if (basket.length === 0) {
                basketContainer.innerHTML = '<p>Basket is empty.</p>';
            }
        });
    });
});
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
