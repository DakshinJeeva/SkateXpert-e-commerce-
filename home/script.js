document.addEventListener('click', function(event) {
    const checkbox = document.getElementById('check');
    const navbar = document.getElementById('navbar');
    
    
    if (checkbox.checked && !navbar.contains(event.target)) {
        checkbox.checked = false; 
});

const container = document.querySelector('.product-container');
const items = container.innerHTML; 
container.innerHTML += items; 
document.addEventListener("DOMContentLoaded", () => {
    const userId = 1;
    fetch('http://localhost:5000/products') 
        .then(response => response.json())
        .then(products => {
            const bootsSection = document.getElementById('bootsSection');
            const bearingsSection = document.getElementById('bearingsSection');
            const skinSuitSection = document.getElementById('skinSuitSection');
            const wheelsSection = document.getElementById('wheelsSection');

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('products-box');

                const addToCartButton = product.stock > 0 ? `
                <button class="add-to-cart-btn" data-id="${product._id}">Add to Cart</button>
            ` : '';
            
            productDiv.innerHTML = `
                <div class="product-image">
                    <img src="http://localhost:5000${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="price">Price: ₹${product.price}</p>                   
                    <p>${product.description}</p>
                    ${addToCartButton}
                    ${product.stock <= 0 ? `<p>Out of Stock</p>` : ''}
                </div>
            `;
            
                switch (product.category) {
                    case 'Boots':
                        bootsSection.appendChild(productDiv);
                        break;
                    case 'Bearings':
                        bearingsSection.appendChild(productDiv);
                        break;
                    case 'Skin Suit':
                        skinSuitSection.appendChild(productDiv);
                        break;
                    case 'Wheel':
                        wheelsSection.appendChild(productDiv);
                        break;
                }
            });
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', handleAddToCart);
            })
            function handleAddToCart(e) {
                const productId = e.target.getAttribute('data-id');
                console.log('Add to Cart button clicked for product ID:', productId);
            
                fetch('http://localhost:5000/verify-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: 1 })
                })
                    .then(res => {
                        if (!res.ok) throw new Error('User not verified');
                        return res.json();
                    })
                    .then(() => {
                        console.log('User verified. Adding product to cart...');
                        return fetch('http://localhost:5000/add-to-cart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: 1, productId })
                        });
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log('Product added to cart:', data);
                    })
                    .catch(err => {
                        console.error('Error:', err.message);
                    });
            }
            
 
        })
        .catch(err => console.error('Error fetching products:', err));
});



