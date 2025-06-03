document.addEventListener("DOMContentLoaded", function () {
    const compareBox = document.querySelector(".compare-container");
    const compareList = JSON.parse(localStorage.getItem("compareProducts")) || [];

    if (compareList.length > 0) {
        compareBox.innerHTML = "";
        compareList.forEach(product => {
            compareBox.innerHTML += `
                <div class='compare-box'>
                    <div class="compare-img">
                        <img src="${product.image}" alt="${product.name}" class="compare-product-img">
                    </div>
                    <div class="compare-title-box">
                        <h5 class="compare-title">${product.name}</h5>
                        <p class="compare-description">${product.description || 'No description available.'}</p>
                        <p class="compare-price">${product.price}</p>
                    </div>
                </div>
            `;
        });
    } else {
        compareBox.innerHTML = "<p>No products selected for comparison.</p>";
    }

    document.querySelector(".back-btn").addEventListener("click", () => {
        window.location.href = "./products.html";
    });
});
