document.addEventListener('DOMContentLoaded', function() {
    const procederpago = document.getElementById('procederpago');
    const pagar = document.getElementById('pagar');

    // Verifica el estado del carrito cuando se carga la página
    function verificarCarrito() {
        const carritoJSON = localStorage.getItem('cart');
        const carrito = JSON.parse(carritoJSON);

        if (!carrito || carrito.length === 0) {
            procederpago.style.display = 'none'; // Oculta el botón de proceder al pago si el carrito está vacío
            return false; // Retorna false para no permitir el pago
        }
        return true; // Retorna true si el carrito tiene productos
    }

    // Inicializa la verificación del carrito
    verificarCarrito();

    procederpago.addEventListener('click', function(event) {
        event.preventDefault();

        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert('Debe iniciar sesión para proceder con el pago.');
            window.location.href = 'login/login.html';
            return; // Salir de la función si el usuario no está autenticado
        }

        // Verificar si el carrito tiene productos antes de permitir el pago
        if (!verificarCarrito()) {
            return; // No permitir el pago si el carrito está vacío
        }

        // Configura el evento de clic para el botón de pago si el carrito no está vacío
        pagar.addEventListener('click', function(event) {
            const tarjeta = document.getElementById('cardNumber').value.trim();
            const fecha = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const codigoPostal = document.getElementById('codigoPostal').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            const provincia = document.getElementById('provincia').value.trim();

            let errorMessage = '';

            // Validación del número de tarjeta
            if (tarjeta.length < 16 || !/^\d+$/.test(tarjeta)) {
                document.getElementById('cardNumberError').textContent = 'Número de tarjeta inválido.';
                errorMessage += 'Por favor, ingresa un número de tarjeta válido.\n';
            } else {
                document.getElementById('cardNumberError').textContent = '';
            }

            // Validación de la fecha de expiración
            var expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryDatePattern.test(fecha)) {
                document.getElementById('expiryDateError').textContent = 'Fecha de expiración inválida (debe ser MM/AA).';
                errorMessage += 'Por favor, ingresa una fecha de expiración válida.\n';
            } else {
                document.getElementById('expiryDateError').textContent = '';
            }

            // Validación del CVV
            if (cvv.length !== 3 || isNaN(cvv)) {
                document.getElementById('cvvError').textContent = 'CVV inválido.';
                errorMessage += 'Por favor, ingresa un código de seguridad válido.\n';
            } else {
                document.getElementById('cvvError').textContent = '';
            }

            // Validación de la dirección
            if (!direccion) {
                document.getElementById('direccionError').textContent = 'La dirección es obligatoria.';
                errorMessage += 'Por favor, ingresa tu dirección.\n';
            } else {
                document.getElementById('direccionError').textContent = '';
            }

            // Validación del código postal
            if (!codigoPostal) {
                document.getElementById('codigoPostalError').textContent = 'El código postal es obligatorio.';
                errorMessage += 'Por favor, ingresa tu código postal.\n';
            } else {
                document.getElementById('codigoPostalError').textContent = '';
            }

            // Validación de la ciudad
            if (!ciudad) {
                document.getElementById('ciudadError').textContent = 'La ciudad es obligatoria.';
                errorMessage += 'Por favor, ingresa tu ciudad.\n';
            } else {
                document.getElementById('ciudadError').textContent = '';
            }

            // Validación de la provincia
            if (!provincia) {
                document.getElementById('provinciaError').textContent = 'La provincia es obligatoria.';
                errorMessage += 'Por favor, ingresa tu provincia.\n';
            } else {
                document.getElementById('provinciaError').textContent = '';
            }
            
            if (errorMessage) {
                alert(errorMessage);
                event.preventDefault();
            } else {
                alert("Procesando el pago. Aprete aceptar para confirmar su pago...");
                event.preventDefault();
                validarToken(token, { direccion, codigoPostal, ciudad, provincia });
            }
        });
    });

    function validarToken(token, datos) {
        fetch('http://localhost:3000/api/usuarios/validar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("ID de usuario:", data.id_usuario);
            const carritoJSON = localStorage.getItem('cart');
            const carrito = JSON.parse(carritoJSON);
            console.log("Carrito parseado:", carrito);
            let total = 0;
            const pedidos = carrito.map(item => {
                const { name, price, quantity, id } = item;
                const priceFloat = typeof price === 'string' ? parseFloat(price) : price;
                const idFloat = typeof id === 'string' ? parseFloat(id) : id;
                const itemTotal = priceFloat * quantity;
                total += itemTotal;
                return {
                    "id_usuario": data.id_usuario,
                    "id_producto": idFloat,
                    "cantidad": quantity,
                    "total": itemTotal,
                    "direccion": datos.direccion,
                    "codigo_postal": datos.codigoPostal,
                    "ciudad": datos.ciudad,
                    "provincia": datos.provincia
                };
            });

            // Crea los pedidos
            crearPedidos(pedidos);
        })
        .catch(error => {
            console.error('Error al validar el token:', error);
            reiniciar();
        });
    }

    async function crearPedidos(pedidos) {
        try {
            let pedidosFallidos = [];

            for (let pedido of pedidos) {
                console.log('Enviando pedido:', pedido); // Imprime los datos del pedido
                
                const response = await fetch('http://localhost:3000/api/pedidos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pedido)
                });

                // Imprime el estado de la respuesta para depuración
                console.log('Estado de la respuesta:', response.status);
                const responseText = await response.text(); // Obtén la respuesta como texto
                console.log('Respuesta del servidor:', responseText);

                if (!response.ok) {
                    // Intentamos obtener el mensaje de error en formato JSON
                    try {
                        const errorData = JSON.parse(responseText);
                        console.log('Datos de error:', errorData); // Depuración: muestra los datos del error
                        pedidosFallidos.push(pedido);
                    } catch (e) {
                        console.error('Error al parsear JSON:', e);
                        pedidosFallidos.push(pedido);
                    }
                }
            }

            if (pedidosFallidos.length === 0) {
                // Si todos los pedidos se procesaron correctamente, vaciamos el carrito
                localStorage.removeItem('cart');
                alert('Pago realizado con éxito');
                window.location.href = 'index.html'; // Redirige a la página de éxito
            } else {
                alert('No se pudo completar el pedido por falta de stock.');
                console.log('Pedidos fallidos:', pedidosFallidos);
                // Aquí puedes manejar los pedidos fallidos si lo deseas
            }
        } catch (error) {
            console.error('Error capturado:', error); // Depuración: muestra el error capturado
            alert('No se pudo procesar el pedido.');
        }
    }

    function reiniciar() {
        localStorage.removeItem('authToken');
        window.location.href = 'login/login.html';
    }
});
