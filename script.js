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

  // ocultar controles si no es admin
  if (rol !== "admin") {
    document.querySelectorAll(".acciones-admin").forEach(div => {
      div.style.display = "none";
    });
  }
});


// ===== SUBIR ARCHIVO =====
function subirArchivo(event, semana) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const nuevo = {
      nombre: archivo.name,
      url: e.target.result // base64
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


// ===== MOSTRAR ARCHIVOS (MEJORADO) =====
function mostrarArchivos() {
  const datos = JSON.parse(localStorage.getItem("archivos")) || {};
  const rol = localStorage.getItem("rol");

  Object.keys(datos).forEach(semana => {
    const contenedor = document.getElementById(`lista-${semana}`);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    datos[semana].forEach((archivo, index) => {
      contenedor.innerHTML += `
        <div class="archivo-item">
          
          <span>📄 ${archivo.nombre}</span>

          <div>

            <!-- VER -->
            <a href="${archivo.url}" target="_blank">
              <button>👁</button>
            </a>

            <!-- DESCARGAR -->
            <a href="${archivo.url}" download="${archivo.nombre}">
              <button>⬇</button>
            </a>

            <!-- ELIMINAR SOLO ADMIN -->
            ${rol === "admin" 
              ? `<button onclick="eliminar('${semana}', ${index})">❌</button>` 
              : ""
            }

          </div>

        </div>
      `;
    });
  });
}


// ===== ELIMINAR =====
function eliminar(semana, index) {
  if (!confirm("¿Eliminar este archivo?")) return;

  let datos = JSON.parse(localStorage.getItem("archivos")) || {};

  if (!datos[semana]) return;

  datos[semana].splice(index, 1);

  localStorage.setItem("archivos", JSON.stringify(datos));

  mostrarArchivos();
}


// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("rol");
  window.location.href = "login.html";
}
function eliminarHTML(btn) {
  const rol = localStorage.getItem("rol");

  if (rol !== "admin") {
    alert("No tienes permiso");
    return;
  }

  if (!confirm("¿Eliminar este archivo de la vista?")) return;

  const item = btn.closest(".archivo-item");
  item.remove();
}
