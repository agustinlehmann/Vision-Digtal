document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado y analizado.");

    const filterLinks = document.querySelectorAll("#navbarNav .nav-item[id^='center'] .nav-link");
    console.log("Enlaces de filtro encontrados:", filterLinks);

    if (filterLinks.length === 0) {
        console.error("No se encontraron enlaces de filtro. Verifica los selectores y el HTML.");
    }

    filterLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const categoria = this.textContent.trim();
            console.log("Categoría seleccionada:", categoria);
            filtrarProductos(categoria);
        });
    });

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
});

function filtrarProductos(categoria) {
    console.log("Filtrando productos por categoría:", categoria);
    fetch('http://localhost:3000/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(data => {
            console.log("Productos obtenidos:", data);
            const productosFiltrados = data.filter(producto => producto.detalle.trim().toLowerCase() === categoria.trim().toLowerCase());
            console.log("Productos filtrados:", productosFiltrados);
            mostrarProductos(productosFiltrados);
        })
        .catch(error => console.error('Error al obtener productos:', error));
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('agregarcosas');
    if (!contenedor) {
        console.error('No se encontró el contenedor con ID "agregarcosas".');
        return;
    }
    contenedor.innerHTML = '';

    productos.forEach(product => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('col-12', 'col-sm-6', 'col-md-4', 'mb-4');
    
        divProducto.innerHTML = `
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

                
    .product-card {
        border-radius: 10px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
                width: 50%;

    }

    .product-card img {
        height: 150px; /* Ajusta la altura de la imagen */
        object-fit: cover;
        width: 100%;
    }

    .product-card:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .product-card .card-body {
        padding: 1.5rem;
    }

    .product-card .card-title {
        font-size: 1.25rem;
        font-weight: bold;
    }

    .product-card .card-text {
        font-size: 1rem;
        color: #333;
    }

    
    
        
</style>
            <div class="card product-card shadow-sm" style="max-width: 100%; margin: auto;" data-id="${product.id_producto}">
                <img src="http://localhost:3000/api/${product.imagen}" alt="Imagen del producto">
                <div class="card-body">
                    <h5 class="card-title">${product.nombre_producto}</h5>
                    <p class="card-text">$${product.precio}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="#" class="btn btn-primary buyboton" data-name="${product.nombre_producto}" data-price="${product.precio}" data-id="${product.id_producto}">
                            <i class="bi bi-cart text-white"></i> Agregar al carrito
                        </a>
                    </div>
                </div>
            </div>
        `;
    
        contenedor.appendChild(divProducto);
    });
    console.log("Productos mostrados en el contenedor:", productos.length);

    // Añadir evento de clic en los productos para mostrar el modal
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-id');
            const product = productos.find(p => p.id_producto == productId);
            if (product) {
                // Asignar directamente desde el objeto product
                const modalImage = `http://localhost:3000/api/${product.imagen || ''}`;
                const modalProductName = product.nombre_producto || 'Nombre no disponible';
                const modalProductPrice = `$${product.precio || 'Precio no disponible'}`;
                const modalStock = `Stock: ${product.stock || 'No disponible'}`;
                const modalProductDetail = product.detalle || 'Detalle no disponible'; // Detalle específico

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
}
