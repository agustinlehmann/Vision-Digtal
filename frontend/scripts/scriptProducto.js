document.addEventListener('DOMContentLoaded', () => {
    const productId = new URLSearchParams(window.location.search).get('id');
    const productDetailsDiv = document.getElementById('product-details');
    const carouselInner = document.getElementById('carousel-inner');

    if (!productId) {
        console.error('No se ha proporcionado un ID de producto.');
        productDetailsDiv.innerHTML = '<p class="text-danger">Error: No se ha proporcionado un ID de producto.</p>';
        return;
    }

    fetch(`http://localhost:3000/api/productos/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return response.json();
        })
        .then(product => {
            const { nombre_producto, detallar, precio, imagen, stock } = product;

            productDetailsDiv.innerHTML = `
                <style>
                    .product-image {
                        max-width: 100%;
                        border-radius: 15px;
                        transition: transform 0.3s ease; /* Transición suave */
                    }
                    .product-image:hover {
                        transform: scale(1.1); /* Escala de la imagen al pasar el mouse */
                    }
                </style>
                <h2>${nombre_producto}</h2>
                <p class="price">$${precio}</p>
                <p class="text-danger">Stock disponible: ${stock}</p>
                <form id="add-to-cart-form">
                    <div class="form-group">
                        <label for="quantity">Cantidad</label>
                        <input type="number" class="form-control" id="quantity" value="1" min="1" max="${stock}">
                    </div>
                    <button type="submit" class="btn btn-custom btn-lg">Añadir al Carrito</button>
                </form>
                <hr>
                <h4 class="details-title">Detalles del Producto</h4>
                <p class="text-muted">${detallar}</p>
            `;

            if (imagen) {
                carouselInner.innerHTML = `
                    <div class="carousel-item active">
                        <img src="http://localhost:3000/api/${imagen}" alt="Imagen del producto" class="product-image">
                    </div>
                `;
            } else {
                console.error('No se encontró imagen para el producto.');
            }

            document.getElementById('add-to-cart-form').addEventListener('submit', (event) => {
                event.preventDefault();
                const quantity = parseInt(document.getElementById('quantity').value);
                if (quantity > stock) {
                    alert('No puedes añadir más productos de los que hay en stock.');
                } else {
                    addToCart({ name: nombre_producto, price: precio, quantity });
                }
            });
        })
        .catch(error => console.error('Error al cargar el producto:', error));

    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Producto añadido al carrito!');
    }
});
