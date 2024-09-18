document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const procederpago = document.getElementById('procederpago');
    const mp = new MercadoPago('TEST-e6e86703-feb8-4555-a64c-5acf8bb55e21', { locale: "es-AR" });
    const pagar = document.getElementById('pagar');

    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const { name, price, quantity } = item;
            const priceFloat = typeof price === 'string' ? parseFloat(price) : price;
            const itemTotal = priceFloat * quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
            cartItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <div>
                        <h5>${name}</h5>
                        <p class="mb-0">Descripción breve del producto.</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="mr-2">$${priceFloat}</span>
                    <span class="mr-2">x${quantity}</span>
                    <button class="btn btn-sm btn-danger" data-name="${name}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>`;
            cartContainer.appendChild(cartItem);
        });

        totalElement.textContent = `$${total}`;

        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => item.name !== name);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    function verificarCarrito() {
        const carritoJSON = localStorage.getItem('cart');
        const carrito = JSON.parse(carritoJSON);
        if (!carrito || carrito.length === 0) {
            procederpago.style.display = 'none';
            return false;
        }
        return true;
    }

    function validarToken(token, datos) {
        fetch('http://localhost:3000/api/usuarios/validar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
            .then(response => response.json())
            .then(data => {
                const carritoJSON = localStorage.getItem('cart');
                const carrito = JSON.parse(carritoJSON);
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

                crearPedidos(pedidos);
            })
            .catch(error => reiniciar());
    }

    async function crearPedidos(pedidos) {
        try {
            let pedidosFallidos = [];
            for (let pedido of pedidos) {
                const response = await fetch('http://localhost:3000/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pedido)
                });
                if (!response.ok) {
                    pedidosFallidos.push(pedido);
                }
            }

            if (pedidosFallidos.length === 0) {
                localStorage.removeItem('cart');
                alert('Pago realizado con éxito');
                window.location.href = 'index.html';
            } else {
                alert('No se pudo completar el pedido por falta de stock.');
            }
        } catch (error) {
            alert('No se pudo procesar el pedido.');
        }
    }

    function reiniciar() {
        localStorage.removeItem('authToken');
        window.location.href = 'login/login.html';
    }

    renderCart();
    verificarCarrito();

    procederpago.addEventListener('click', function (event) {
        event.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Debe iniciar sesión para proceder con el pago.');
            window.location.href = 'login/login.html';
            return;
        }
        if (!verificarCarrito()) return;

        pagar.addEventListener('click', async function (event) {
            const tarjeta = document.getElementById('cardNumber').value.trim();
            const fecha = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const codigoPostal = document.getElementById('codigoPostal').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            const provincia = document.getElementById('provincia').value.trim();
            const { name, price, quantity } = item;
            const priceFloat = typeof price === 'string' ? parseFloat(price) : price;
            const itemTotal = priceFloat * quantity;
            total += itemTotal;
            try {
                const orderData = {
                    title: name,
                    quantity: quantity,
                    price: priceFloat,
                    total: itemTotal
                };
                const response = await fetch("htto://localhost:3000/api/create_preference", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer' + token
                    },
                    body: JSON.stringify(orderData),
                })

                const preference = await response.json()
                createCheckoutButton(preference.id);
            } catch (error) {
                alert("error: (")
            }
            const createCheckoutButton = (preferenceId) => {
                const bricksBuilder = mp.bricks();

                const renderComponent = async () => {
                    if (window.checkoutButton) window.checkoutButton.unmount();
                    await bricksBuilder.create("wallet", "wallet_container", {
                        initialization: {
                            preferenceId: "<PREFERENCE_ID>",
                        },
                        customization: {
                            texts: {
                                valueProp: 'smart_option',
                            },
                        },
                    });

                }
                renderComponent()
            }



            let errorMessage = '';

            if (tarjeta.length < 16 || !/^\d+$/.test(tarjeta)) {
                document.getElementById('cardNumberError').textContent = 'Número de tarjeta inválido.';
                errorMessage += 'Por favor, ingresa un número de tarjeta válido.\n';
            } else {
                document.getElementById('cardNumberError').textContent = '';
            }

            const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryDatePattern.test(fecha)) {
                document.getElementById('expiryDateError').textContent = 'Fecha de expiración inválida (debe ser MM/AA).';
                errorMessage += 'Por favor, ingresa una fecha de expiración válida.\n';
            } else {
                document.getElementById('expiryDateError').textContent = '';
            }

            if (cvv.length !== 3 || isNaN(cvv)) {
                document.getElementById('cvvError').textContent = 'CVV inválido.';
                errorMessage += 'Por favor, ingresa un código de seguridad válido.\n';
            } else {
                document.getElementById('cvvError').textContent = '';
            }

            if (!direccion) {
                document.getElementById('direccionError').textContent = 'La dirección es obligatoria.';
                errorMessage += 'Por favor, ingresa tu dirección.\n';
            } else {
                document.getElementById('direccionError').textContent = '';
            }

            if (!codigoPostal) {
                document.getElementById('codigoPostalError').textContent = 'El código postal es obligatorio.';
                errorMessage += 'Por favor, ingresa tu código postal.\n';
            } else {
                document.getElementById('codigoPostalError').textContent = '';
            }

            if (!ciudad) {
                document.getElementById('ciudadError').textContent = 'La ciudad es obligatoria.';
                errorMessage += 'Por favor, ingresa tu ciudad.\n';
            } else {
                document.getElementById('ciudadError').textContent = '';
            }

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
});
