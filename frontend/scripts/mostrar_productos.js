const agregarcosas = document.getElementById('agregarcosas');

fetch('http://localhost:3000/api/productos', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    agregarcosas.innerHTML = data.map(product => `
         <style>
                    .buyboton {
    background-color: #FFA755;
    border: none;
    color: white;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.buyboton:hover {
    background-color: #FF8A40;
    transform: scale(1.05);
}

                </style>
        <div class="col-lg-2 col-md-4 mb-4">
            <div class="card product-card" onclick="window.location.href='producto.html?id=${product.id_producto}'" style="cursor: pointer;">
                <img src="http://localhost:3000/api/${product.imagen}" alt="Imagen del producto">
                <div class="card-body">
                    <h5 class="card-title">${product.nombre_producto}</h5>
                    <p class="card-text" data-price="${product.precio}">$${product.precio}</p>
                    <div class="d-flex justify-content-between">
                        <a href="#" class="btn btn-primary buyboton" 
                           data-name="${product.nombre_producto}" 
                           data-price="${product.precio}" 
                           data-id="${product.id_producto}">
                            <i class="bi bi-cart text-white">Agregar al carrito</i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Añadir evento de clic al botón "Agregar al carrito"
    const botones = document.querySelectorAll('.buyboton');
    botones.forEach(boton => {
        boton.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que el enlace navegue
            event.stopPropagation(); // Detiene la propagación del evento
            const productId = boton.getAttribute('data-id');
            // Lógica para agregar al carrito
            console.log(`Producto ${productId} añadido al carrito`);
        });
    });
})
.catch(error => {
    console.error('Error:', error);
});
