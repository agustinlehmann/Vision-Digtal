document.addEventListener('DOMContentLoaded', () => {
 const cartContainer = document.getElementById('cart-items');
 const totalElement = document.getElementById('cart-total');

 function renderCart() {
     let cart = JSON.parse(localStorage.getItem('cart')) || [];
     cartContainer.innerHTML = '';

     let total = 0;

     cart.forEach(item => {
         const { name, price, quantity } = item;
         const priceFloat = typeof price === 'string' ? parseFloat(price) : price; // Asegúrate que price sea un número
         const itemTotal = priceFloat * quantity;
         total += itemTotal;

         const cartItem = document.createElement('div');
         cartItem.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
         cartItem.innerHTML = `
             <div class="d-flex align-items-center">
                 <img src="https://via.placeholder.com/50" alt="${name}" class="mr-3">
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

 renderCart();
});



