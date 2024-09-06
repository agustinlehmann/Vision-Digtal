document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');

  form.addEventListener('submit', function(event) {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      let errorMessage = '';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
          errorMessage += 'Por favor, ingresa un correo electrónico válido.\n';
      }
      
      if (password === '') {
          errorMessage += 'La contraseña no puede estar vacía.\n';
      }
      if (errorMessage) {
          alert(errorMessage);
          event.preventDefault();
      } else {
          event.preventDefault();
          iniciarSesion(email, password);
      }
  });
});

function iniciarSesion(email, password) {
  if (email === 'admin10@gmail.com' && password === '12345') {
      localStorage.setItem('userRole', 'admin');
      window.location.href = '../index.html';
  } else {
      const cuenta = {
          email: email,
          password: password
      };
      fetch('http://localhost:3000/api/usuarios/iniciar-sesion', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(cuenta)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userRole', 'user'); // Usuario normal
          window.location.href = '../index.html';
      });
  }
}
