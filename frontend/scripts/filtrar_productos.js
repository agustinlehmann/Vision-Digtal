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
            <div class="card product-card" onclick="window.location.href='producto.html?id=${product.id_producto}'" style="cursor: pointer;">
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
    if (typeof botoncomprar === 'function') {
        botoncomprar();
    }
}