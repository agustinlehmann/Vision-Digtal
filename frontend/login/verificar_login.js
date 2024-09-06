document.addEventListener('DOMContentLoaded', function() {
  const userRole = localStorage.getItem('userRole');
  const adminButton = document.getElementById('adminButton');
  const carritoButton = document.querySelector('.nav-link[href="carrito.html"]');
  const logeado = document.getElementById('logeadosino');
  
  // Crear el botón de cerrar sesión
  const logoutButton = document.createElement('li');
  logoutButton.classList.add('nav-item');
  logoutButton.innerHTML = '<a class="nav-link" href="#" onclick="cerrarSesion()">Cerrar Sesión</a>';
  
  verificarLogin();

  function verificarLogin() {
      const token = localStorage.getItem('authToken');
      if (token) {
          console.log('Usuario logueado');
          logeado.textContent = 'Cerrar Sesión';
          logeado.removeAttribute('href');
          logeado.addEventListener('click', cerrarSesion);
      } else {
          console.log('Usuario no logueado');
      }
  }

  // Limpiar la navbar antes de añadir los elementos
  const navbarNav = document.querySelector('.navbar-nav');

// Verifica si el contenedor de la barra de navegación existe
if (navbarNav) {
    // Limpiar posibles botones de cerrar sesión previos
    navbarNav.querySelectorAll('.nav-item').forEach(item => {
        const link = item.querySelector('a');
        if (link && link.textContent === 'Cerrar Sesión') {
            item.remove();
        }
    });

    // Manejar visibilidad de botones según el rol
    if (userRole === 'admin') {
        // Ocultar el botón de carrito si existe
        if (carritoButton) carritoButton.style.display = 'none';
        if (logeado) logeado.style.display = 'none';
        // Mostrar el botón de cerrar sesión y el botón de admin
        if (logoutButton) navbarNav.appendChild(logoutButton);
        if (adminButton) navbarNav.appendChild(adminButton);
    } else if (userRole === 'user') {
        // Ocultar el botón de admin si existe
        if (adminButton) adminButton.style.display = 'none';
        // Mostrar el botón de cerrar sesión y el botón de carrito
        if (logoutButton) navbarNav.appendChild(logoutButton);
        if (carritoButton) navbarNav.appendChild(carritoButton);
    } else {
        // Si el rol no es admin ni user, ocultar ambos botones
        if (adminButton) adminButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
    }
} else {
    console.error('No se encontró .navbar-nav en el DOM');
}

});

function cerrarSesion() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  window.location.href = 'index.html';
}
