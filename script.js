// ===== USUARIOS =====
const usuarios = [
  { nombre: "admin", password: "1234", rol: "admin" },
  { nombre: "usuario", password: "0000", rol: "usuario" }
];

// ===== LOGIN =====
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  // Si estamos en login.html
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const user = document.getElementById("usuario").value.trim();
      const pass = document.getElementById("password").value.trim();
      const mensaje = document.getElementById("mensaje-error");

      const encontrado = usuarios.find(u =>
        u.nombre === user && u.password === pass
      );

      if (encontrado) {
        localStorage.setItem("rol", encontrado.rol);
        window.location.href = "index.html";
      } else {
        mensaje.textContent = "❌ Usuario o contraseña incorrectos";
      }
    });
  }

  // ===== CONTROL EN INDEX =====
  const rol = localStorage.getItem("rol");

  if (window.location.pathname.includes("index.html")) {
    if (!rol) {
      window.location.href = "login.html";
    }

    if (rol === "admin") {
      document.querySelectorAll(".acciones-admin").forEach(div => {
        div.innerHTML = `
          <button onclick="eliminar(this)">Eliminar</button>
          <input type="file" onchange="subirArchivo(this)">
        `;
      });
    }
  }
});

// ===== FUNCIONES =====
function eliminar(btn) {
  const card = btn.closest(".semana-card");
  card.remove();
}

function subirArchivo(input) {
  alert("Archivo subido (simulado)");
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
