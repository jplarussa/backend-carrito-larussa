const socket = io();

//Update and render the products with websocket
socket.on('update-products', (data) => {

    const products = document.getElementById('products');
    let renderedProducts = "";

    data.forEach(p => {
        renderedProducts += `
        <div class="product-card">
        <h4>${p.title}</h3>
        <p>${p.description}</p>
        <p>Price: $ ${p.price}</p>
        <p>Stock: ${p.stock}</p>
        <p>Category: ${p.category}</p>
        <p>Code: ${p.code}</p>
        <p>ID: ${p.id}</p>
        <button class="btn btn-danger delete-btn" data-id="${p.id}">Delete</button>
        </div>`
    })

    products.innerHTML = renderedProducts;

    // Delete an existing product
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');

            fetch('/api/products/' + productId, {
                method: 'DELETE'
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete product.');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    });
});

//Get the data from the Form and generate HTTP Request to server
const productForm = document.getElementById('product-form');
const actionSelect = document.getElementById('operation');
const idInput = document.getElementById('id-field');

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(productForm);
    const productData = Object.fromEntries(formData.entries());

    // Validations
    if (!productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || !productData.stock || !productData.status || !productData.category) {
        return alert('Please fill in all fields.');
    }
    if (isNaN(Number(productData.code)) || isNaN(Number(productData.stock))) {
        return alert('Code and stock must be integers.');
    }
    if (productData.status !== 'true' && productData.status !== 'false') {
        return alert('Status must be true or false.');
    }

    const action = actionSelect.value;

    if (action === 'Add') {
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then(response => response.json())
            .then(data => {
                alert('Product added successfully!');
                productForm.reset();
            })
            .catch(error => console.error(error));
    } else if (action === 'Update') {
        const id = idInput.value;

        fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then(response => response.json())
            .then(data => {
                alert(`Product with ID ${id} updated successfully!`);
                productForm.reset();
            })
            .catch(error => console.error(error));
    }
});
