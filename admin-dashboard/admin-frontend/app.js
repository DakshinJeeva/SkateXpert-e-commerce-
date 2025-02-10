document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').files[0];
    const category = document.getElementById('category').value;
    const stock = document.getElementById('stock').value;
    const description = document.getElementById('description').value;

    // Send the product data to the backend
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('description', description);

    fetch('http://localhost:5000/products/add', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            // Add the product to the list
            renderProduct(data);
        })
        .catch((err) => console.error('Error adding product:', err));
});

// Function to render a product
function renderProduct(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-div');

    productDiv.innerHTML = `
        <h3>Title: ${product.name}</h3>
        <p>Category: ${product.category}</p>
        <p>Price: Rs.${product.price}</p>
        <img src="http://localhost:5000${product.image}" alt="${product.name}" width="100">
        <input type="number" class="stock-input" value="${product.stock}" min="0">
        <button class="update-stock-btn">Update Stock</button>
        <button class="delete-btn">Delete</button>
    `;

    document.getElementById('productList').appendChild(productDiv);

    // Attach update stock functionality
    productDiv.querySelector('.update-stock-btn').addEventListener('click', () => {
        const updatedStock = productDiv.querySelector('.stock-input').value;
        fetch(`http://localhost:5000/products/update-stock/${product._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: updatedStock }),
        })
            .then((response) => response.json())
            .then((updatedProduct) => {
                console.log('Stock updated:', updatedProduct);
            })
            .catch((err) => console.error('Error updating stock:', err));
    });

    // Attach delete functionality
    productDiv.querySelector('.delete-btn').addEventListener('click', async () => {
        // Confirmation before deletion
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:5000/products/delete/${product._id}`, { method: 'DELETE' });
    
                if (response.ok) {
                    // Remove the product from the DOM
                    productDiv.remove();
                    console.log(`Product with id ${product._id} deleted.`);
                    alert('Product deleted successfully.');
                } else {
                    console.error('Error deleting product:', response.statusText);
                    alert(`Error: Unable to delete product. ${response.statusText}`);
                }
            } catch (err) {
                console.error('Error deleting product:', err);
                alert('An error occurred while deleting the product. Please try again later.');
            }
        }
    });
    
}

// Load existing products on page load
function loadProducts() {
    fetch('http://localhost:5000/products')
        .then((response) => response.json())
        .then((products) => {
            products.forEach((product) => renderProduct(product));
        })
        .catch((err) => console.error('Error loading products:', err));
}

document.addEventListener('DOMContentLoaded', loadProducts);

// Session check
fetch('session_check.php')
    .then((response) => response.json())
    .then((data) => {
        if (!data.logged_in) {
            // Redirect to login page if not logged in
            window.location.href = 'login.html';
        }
    })
    .catch((err) => console.error('Error checking session:', err));
