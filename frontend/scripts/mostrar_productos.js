const agregarcosas = document.getElementById('agregarcosas');

// Crear el modal
const modalHtml = `
<div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="productModalLabel">Detalles del Producto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <img id="modalImage" src="" alt="Imagen del producto" class="img-fluid mb-3">
                <h5 id="modalProductName" class="fw-bold"></h5>
                <p id="modalProductPrice" class="text-muted"></p>
                <p id="stok" class="text-secondary"></p>
                <p id="modalProductDetail" class="text-secondary"></p> <!-- Nuevo elemento para el detalle específico -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHtml);

// Obtener los productos
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
    console.log(data); // Ver los datos recibidos

    agregarcosas.innerHTML = data.map(product => `
        <div class="col-lg-2 col-md-4 mb-4">
            <div class="card product-card shadow-sm" data-id="${product.id_producto}">
                <img src="http://localhost:3000/api/${product.imagen}" alt="Imagen del producto" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${product.nombre_producto}</h5>
                    <p class="card-text" data-price="${product.precio}">$${product.precio}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="#" class="btn btn-primary buyboton" data-name="${product.nombre_producto}" data-price="${product.precio}" data-id="${product.id_producto}">
                            <i class="bi bi-cart text-white"></i> Agregar al carrito
                        </a>
                    </div>
                </div>
            </div>
        </div>`).join('');

    // Añadir evento de clic en los productos
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-id');
            const product = data.find(p => p.id_producto == productId);
            if (product) {
                // Asignar directamente desde el objeto product
                const modalImage = `http://localhost:3000/api/${product.imagen || ''}`;
                const modalProductName = product.nombre_producto || 'Nombre no disponible';
                const modalProductPrice = `$${product.precio || 'Precio no disponible'}`;
                const modalStock = `Stock: ${product.stock || 'No disponible'}`;
                const modalProductDetail = product.detallar || 'Detalle no disponible'; // Nuevo detalle específico

                // Mostrar el modal
                document.getElementById('modalImage').src = modalImage;
                document.getElementById('modalProductName').textContent = modalProductName;
                document.getElementById('modalProductPrice').textContent = modalProductPrice;
                document.getElementById('stok').textContent = modalStock;
                document.getElementById('modalProductDetail').textContent = modalProductDetail; // Asignar detalle específico

                const modal = new bootstrap.Modal(document.getElementById('productModal'));
                modal.show();
            }
        });
    });
})
.catch(error => {
    console.error('Error:', error);
});
