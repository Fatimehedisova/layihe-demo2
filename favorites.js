document.addEventListener('DOMContentLoaded', () => {
    const favoriteList = document.getElementById('favorite-list');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        favoriteList.innerHTML = "<p class='favorite-text'>There is no favorite product.</p>";
        return;
    }
    favorites.forEach(products => {
        const card = document.createElement('div');
        card.classList.add('product-favorite-card');
        card.innerHTML = `
          
                    <div class="favorite-about">
                        <button class="delete-favorite" data-id='${products.id}'>
                            <i class="fa-solid fa-ban" style="color: #000000;"></i>
                        </button>
                        <div class="favorite-img">
                            <img src="${products.image}"
                                alt="${products.name}" class="favorite-product-img">
                        </div>
                        <div class="favorite-content">
                            <h5 class="favorite-title">${products.name}</h5>
                            <p class="favorite-price">${products.price}</p>
                        </div>
                    </div>

                    <div class="quick-view">
                        <button class="product-view">Quick view</button>
                    </div>
            
        `
        favoriteList.appendChild(card)
    })
    document.querySelectorAll('.delete-favorite').forEach(btn=>{
        btn.addEventListener('click',()=>{
            let id = btn.getAttribute('data-id');
            removeFromFavorites(id);
            location.reload()
        })
    })
})
function removeFromFavorites(id){
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(products=>products.id != id)
    localStorage.setItem('favorites', JSON.stringify(favorites))
}