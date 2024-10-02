document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const nombre = document.getElementById('nombreproducto').value;
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('stock').value;
    const detalle = document.getElementById('detalle').value;
    const detallar = document.getElementById('detallar').value; // Nuevo campo para detalle específico
    const imagen = document.getElementById('imagen').files[0]; // Obtiene el archivo seleccionado

    let errorMessage = '';

    // Validación para el campo de nombre del producto
    if (nombre === '') {
      errorMessage += 'El nombre del producto no puede estar vacío.\n';
    } else if (nombre.length < 5) {
      errorMessage += 'El nombre del producto debe tener al menos 5 caracteres.\n';
    }

    // Validación para el campo de precio
    if (precio === '') {
      errorMessage += 'El precio no puede estar vacío.\n';
    } else if (isNaN(precio) || parseFloat(precio) <= 0) {
      errorMessage += 'El precio debe ser un número mayor que 0.\n';
    }

    // Validación para el campo de cantidad (stock)
    if (cantidad === '') {
      errorMessage += 'La cantidad no puede estar vacía.\n';
    } else if (isNaN(cantidad) || parseInt(cantidad) < 0) {
      errorMessage += 'La cantidad debe ser un número mayor o igual a 0.\n';
    }

    // Validación para el campo de detalle (select)
    if (detalle === '') {
      errorMessage += 'Debe seleccionar un tipo de producto en el detalle.\n';
    }

    // Validación para el campo de detalle específico
    if (detallar === '') {
      errorMessage += 'El detalle específico no puede estar vacío.\n';
    }

    if (errorMessage) {
      alert(errorMessage);
    } else {
      console.log("Registro completo");

      // Crea un objeto FormData
      const formData = new FormData();
      formData.append('nombre_producto', nombre);
      formData.append('precio', parseFloat(precio));
      formData.append('stock', parseInt(cantidad));
      formData.append('detalle', detalle);
      formData.append('detallar', detallar); // Agrega el detalle específico
      if (imagen) formData.append('imagen', imagen); // Agrega el archivo si existe

      // Verifica el contenido de FormData
      console.log('FormData:', [...formData.entries()]);

      // Envía los datos usando fetch
      fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.error}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Producto registrado:', data);
        alert('Producto registrado con éxito');
        form.reset(); // Limpia el formulario después del envío
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar el producto');
      });
    }
  });
});
