// ===== USUARIOS =====
const usuarios = [
  { nombre: "admin", password: "1234", rol: "admin" },
  { nombre: "jose", password: "0000", rol: "usuario" }
];

// ===== INICIO =====
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  // ===== LOGIN (NO TOCADO) =====
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

    return;
  }

  // ===== INDEX =====
  const rol = localStorage.getItem("rol");

  if (!rol) {
    window.location.href = "login.html";
  }

  mostrarArchivos();

  if (rol !== "admin") {
    document.querySelectorAll(".acciones-admin").forEach(div => {
      div.style.display = "none";
    });
  }
});


// ===== SUBIR ARCHIVO (CORREGIDO) =====
function subirArchivo(event, semana) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const nuevo = {
      nombre: archivo.name,
      url: e.target.result   // ✅ base64 correcto
    };

    let datos = JSON.parse(localStorage.getItem("archivos")) || {};

    if (!datos[semana]) {
      datos[semana] = [];
    }

    datos[semana].push(nuevo);

    localStorage.setItem("archivos", JSON.stringify(datos));

    mostrarArchivos();
  };

  reader.readAsDataURL(archivo);
}


// ===== MOSTRAR =====
function mostrarArchivos() {
  const datos = JSON.parse(localStorage.getItem("archivos")) || {};

  Object.keys(datos).forEach(semana => {
    const contenedor = document.getElementById(`lista-${semana}`);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    datos[semana].forEach((archivo, index) => {
      contenedor.innerHTML += `
        <div>
      <a href="${archivo.url}" target="_blank" download="${archivo.nombre}">
  📄 ${archivo.nombre}
</a>

          ${localStorage.getItem("rol") === "admin"
            ? `<button onclick="eliminar('${semana}', ${index})">❌</button>`
            : ""}
        </div>
      `;
    });
  });
}


// ===== ELIMINAR =====
function eliminar(semana, index) {
  let datos = JSON.parse(localStorage.getItem("archivos")) || {};
  datos[semana].splice(index, 1);
  localStorage.setItem("archivos", JSON.stringify(datos));
  mostrarArchivos();
}


// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("rol");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}
