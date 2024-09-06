if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}
function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartBadge = document.querySelector('.navbar-nav .badge');
    if (cartBadge) {
        cartBadge.textContent = cart.length;
    }
}
function botoncomprar(){
    document.querySelectorAll('.buyboton').forEach(button => {
        button.addEventListener('click', function(event) {
        event.preventDefault();
        console.log("a")
        console.log(this)
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        let quantity = this.getAttribute('data-quantity') || 1;
        const id = this.getAttribute('data-id');

        const cart = JSON.parse(localStorage.getItem('cart'));
        let existingItem = cart.find(item => item.name === name);

        if(existingItem){
            existingItem.quantity++;
            console.log(cart)
            console.log(existingItem)
        }else {
            quantity = 1;
            cart.push({ name, price, quantity, id });
            console.log(cart)
        }    

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        alert(`Añadido al carrito: ${name}`);
    });
    });
}
setTimeout(botoncomprar, 100)
updateCart();
