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
    if (!Array.isArray(data)) {
        throw new Error('La respuesta no es un arreglo.');
    }

    agregarcosas.innerHTML = data.map(product => {
        return `
        <div class="col-lg-3 col-md-4 mb-4">
            <div class="card product-card bg-white shadow"> <!-- Cambiado a bg-white -->
                <img class="card-img-top" src="http://localhost:3000/api/${product.imagen}" alt="Imagen del producto">
                <div class="card-body">
                    <form id="asd${product.id_producto}">
                        <h5 class="card-title">${product.nombre_producto}</h5>
                        <p class="card-text" data-price="${product.precio}">$${product.precio}</p>
                        <p class="card-text" data-stock="${product.stock}">Stock: ${product.stock}</p>
                        <p class="card-text" data-detalle="${product.detalle}">Detalle: ${product.detalle}</p>
                        <div class="d-flex justify-content-between">
                            <a href="#" id="a${product.id_producto}" class="btn btn-primary buy-btn" data-name="${product.nombre_producto}" data-price="${product.precio}">
                                <i class="bi bi-pencil-square text-white"></i>
                            </a>
                            <a href="#" id="b${product.id_producto}" class="btn btn-danger buy-btn" data-name="${product.nombre_producto}" data-price="${product.precio}">
                                <i class="bi bi-trash text-trash"></i>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;
    }).join('');
    

    for (let key in data) {
        const boton1 = document.getElementById('a' + data[key].id_producto);
        const boton2 = document.getElementById('b' + data[key].id_producto);
        const divasd = document.getElementById('asd' + data[key].id_producto);

        boton1.addEventListener('click', (event) => {
            event.preventDefault();
            actualizar(data[key].id_producto, divasd, data[key]);
        });
        boton2.addEventListener('click', (event) => {
            event.preventDefault();
            eliminar(data[key].id_producto);
        });
    }
})
.catch(error => {
    console.error('Error:', error);
});

function eliminar(id2) {
    console.log('id ' + id2);
    fetch('http://localhost:3000/api/productos/' + id2, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log('Eliminado correctamente');
        location.reload();
    })
    .catch(error => console.error(error));
}

function actualizar(id2, div, product) {
    const form = document.createElement('form');
    form.className = 'p-4 border rounded bg-light shadow-lg mx-auto';

    const container = document.createElement('div');
    container.className = 'container';
    form.appendChild(container);

    // Nombre del producto
    const nombreGroup = document.createElement('div');
    nombreGroup.className = 'mb-3';
    const nombreLabel = document.createElement('label');
    nombreLabel.className = 'form-label';
    nombreLabel.textContent = 'Nombre del producto';
    const nombre = document.createElement('input');
    nombre.type = 'text';
    nombre.className = 'form-control';
    nombre.value = product.nombre_producto; // Cargar el valor actual
    nombreGroup.appendChild(nombreLabel);
    nombreGroup.appendChild(nombre);

    // Precio del producto
    const precioGroup = document.createElement('div');
    precioGroup.className = 'mb-3';
    const precioLabel = document.createElement('label');
    precioLabel.className = 'form-label';
    precioLabel.textContent = 'Precio del producto';
    const precio = document.createElement('input');
    precio.type = 'number';
    precio.className = 'form-control';
    precio.value = product.precio; // Cargar el valor actual
    precioGroup.appendChild(precioLabel);
    precioGroup.appendChild(precio);

    // Cantidad del producto
    const cantidadGroup = document.createElement('div');
    cantidadGroup.className = 'mb-3';
    const cantidadLabel = document.createElement('label');
    cantidadLabel.className = 'form-label';
    cantidadLabel.textContent = 'Stock del producto';
    const cantidad = document.createElement('input');
    cantidad.type = 'number';
    cantidad.className = 'form-control';
    cantidad.value = product.stock; // Cargar el valor actual
    cantidadGroup.appendChild(cantidadLabel);
    cantidadGroup.appendChild(cantidad);

    // Detalle del producto
    const detalleGroup = document.createElement('div');
    detalleGroup.className = 'mb-3';
    const detalleLabel = document.createElement('label');
    detalleLabel.className = 'form-label';
    detalleLabel.textContent = 'Detalle del producto';
    const detalleSelect = document.createElement('select');
    detalleSelect.className = 'form-control';
    const detalles = ['Teclados', 'Fundas', 'Cargadores', 'Auriculares', 'Parlantes', 'Otros'];
    detalles.forEach(detalle => {
        const option = document.createElement('option');
        option.value = detalle;
        option.textContent = detalle;
        if (detalle === product.detalle) option.selected = true; // Seleccionar el detalle actual
        detalleSelect.appendChild(option);
    });
    detalleGroup.appendChild(detalleLabel);
    detalleGroup.appendChild(detalleSelect);

    // Botón de actualización
    const botonGroup = document.createElement('div');
    botonGroup.className = 'd-flex justify-content-end';
    const boton = document.createElement('button');
    boton.type = 'submit';
    boton.className = 'btn btn-primary';
    boton.textContent = 'Actualizar';
    botonGroup.appendChild(boton);

    // Añadir grupos al contenedor
    container.appendChild(nombreGroup);
    container.appendChild(precioGroup);
    container.appendChild(cantidadGroup);
    container.appendChild(detalleGroup);
    container.appendChild(botonGroup);

    // Añadir contenedor al div principal
    div.appendChild(form);

    // Manejador del evento click para el botón
    boton.addEventListener('click', (event) => {
        event.preventDefault();
        const producto = {};

        if (nombre.value.trim() !== '') producto.nombre_producto = nombre.value;
        if (precio.value.trim() !== '') producto.precio = parseFloat(precio.value);
        if (cantidad.value.trim() !== '') producto.stock = parseInt(cantidad.value);
        if (detalleSelect.value.trim() !== '') producto.detalle = detalleSelect.value;

        actualizarProducto(id2, producto);
        div.innerHTML = '';
    });
}

function actualizarProducto(id2, producto) {
    fetch('http://localhost:3000/api/productos/' + id2, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log('Actualizado correctamente');
        
        // Actualizar los elementos en el DOM sin recargar la página
        document.querySelector(`#asd${id2} h5`).textContent = producto.nombre_producto || data.nombre_producto;
        document.querySelector(`#asd${id2} [data-price]`).textContent = `$${producto.precio || data.precio}`;
        document.querySelector(`#asd${id2} [data-stock]`).textContent = `Stock: ${producto.stock || data.stock}`;
        document.querySelector(`#asd${id2} [data-detalle]`).textContent = `Detalle: ${producto.detalle || data.detalle}`;
    })
    .catch(error => console.error(error));
}
