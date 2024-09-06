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
                <div class="col-lg-2 col-md-4 mb-4">
                    <div class="card product-card">
                       <img src="http://localhost:3000/api/${product.imagen}" alt="Imagen del producto">
                        <div class="card-body">
                        <form id="formproductos">
                            <h5 class="card-title">${product.nombre_producto}</h5>
                            <p class="card-text" data-price="${product.precio}">$${product.precio}</p>
                            <div class="d-flex justify-content-between">
                                <a href="#" class="btn btn-primary buyboton" data-name="${product.nombre_producto}" data-price="${product.precio}" data-id="${product.id_producto}"">
                                    <i class="bi bi-cart text-white">Agregar al carrito</i>
                                </a>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>`).join('');
    })
    .catch(error => {
        console.error('Error:', error);
    });