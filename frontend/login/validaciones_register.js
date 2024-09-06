document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');

  form.addEventListener('submit', function(event) {
      const nombre = document.getElementById('nombre_usuario').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const passwordConfirm = document.getElementById('password_confirm').value.trim();
      const direccion = document.getElementById('direccion').value.trim();
      let errorMessage = '';

      if (nombre === '') {
          errorMessage += 'El nombre de usuario no puede estar vacío.\n';
      } else if (nombre.length < 5) {
          errorMessage += 'El nombre de usuario debe tener al menos 5 caracteres.\n';
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
          errorMessage += 'Por favor, ingresa un correo electrónico válido.\n';
      }
      if (password === '') {
          errorMessage += 'La contraseña no puede estar vacía.\n';
      } else if (password.length < 8) {
          errorMessage += 'La contraseña debe tener al menos 8 caracteres.\n';
      } else if (password !== passwordConfirm) {
          errorMessage += 'Las contraseñas no coinciden.\n';
      }

      if (direccion === '') {
          errorMessage += 'La dirección no puede estar vacía.\n';
      } else if (direccion.length < 4) {
          errorMessage += 'La dirección debe tener al menos 4 caracteres.\n';
      }

      // Mostrar mensaje de error si la validación falla
      if (errorMessage) {
          alert(errorMessage);
          event.preventDefault(); // Evitar el envío del formulario
      } else {
          console.log("registro completo")
          event.preventDefault(); // Evitar el envío del formulario para redirigir con JavaScript
          registrar(nombre, email, password, direccion);
      }
  });
});

function registrar(name, mail, pass, dir) {
  const user = {
      nombre_usuario: name,
      email: mail,
      password: pass,
      direccion: dir
  };

  fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      console.log('Usuario registrado:', data);
      window.location.href = '../index.html';
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
