document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("rol");
  if (!rol) {
    window.location.href = "login.html";
    return;
  }

  const semanas = document.querySelectorAll(".semana-card");

  semanas.forEach((card, index) => {
    const semanaIndex = index + 1;

    // Eliminar botón "Actividades" si existe (solo para admin)
    const botonActividades = card.querySelector("button");
    if (rol === "admin" && botonActividades) {
      botonActividades.remove();
    }

    // Crear contenedor para funciones admin
    let acciones = card.querySelector(".acciones-admin");
    if (!acciones) {
      acciones = document.createElement("div");
      acciones.classList.add("acciones-admin");
      card.appendChild(acciones);
    }

    // Contenedor de lista de archivos
    let listaCont = card.querySelector(".lista-archivos");
    if (!listaCont) {
      listaCont = document.createElement("div");
      listaCont.className = "lista-archivos";
      card.appendChild(listaCont);
    }

    if (rol === "admin") {
      // Crear input oculto para subir PDFs
      const inputFile = document.createElement("input");
      inputFile.type = "file";
      inputFile.accept = "application/pdf";
      inputFile.multiple = true;
      inputFile.style.display = "none";

      // Botón subir
      const subirBtn = document.createElement("button");
      subirBtn.textContent = "📤 Subir PDF";
      subirBtn.classList.add("btn-subir");

      // Botón eliminar todo
      const eliminarTodosBtn = document.createElement("button");
      eliminarTodosBtn.textContent = "🗑️ Eliminar Todo";
      eliminarTodosBtn.classList.add("btn-eliminar");

      // Agregar botones al card
      acciones.appendChild(inputFile);
      acciones.appendChild(subirBtn);
      acciones.appendChild(eliminarTodosBtn);

      // Eventos
      subirBtn.addEventListener("click", () => inputFile.click());

      inputFile.addEventListener("change", async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const guardados = JSON.parse(localStorage.getItem(`semana_${semanaIndex}`)) || [];

        for (const f of files) {
          if (f.type !== "application/pdf") continue;
          const dataUrl = await readFileAsDataURL(f);
          guardados.push({
            name: f.name,
            data: dataUrl,
            uploadedAt: new Date().toISOString(),
          });
        }

        localStorage.setItem(`semana_${semanaIndex}`, JSON.stringify(guardados));
        inputFile.value = "";
        renderLista(semanaIndex, listaCont);
      });

      eliminarTodosBtn.addEventListener("click", () => {
        if (confirm(`¿Eliminar todos los archivos de la Semana ${semanaIndex}?`)) {
          localStorage.removeItem(`semana_${semanaIndex}`);
          renderLista(semanaIndex, listaCont);
        }
      });

      renderLista(semanaIndex, listaCont);
    }

    if (rol === "usuario") {
      // Si eres usuario, no mostrar opciones admin
      acciones.style.display = "none";
      listaCont.style.display = "none";
    }
  });

  // Cerrar sesión
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("rol");
      window.location.href = "login.html";
    });
  }
});

// Función para leer PDFs
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Error al leer archivo");
    reader.readAsDataURL(file);
  });
}

// Mostrar lista de archivos PDF
function renderLista(semana, contenedor) {
  contenedor.innerHTML = "";
  const archivos = JSON.parse(localStorage.getItem(`semana_${semana}`)) || [];

  if (archivos.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No hay archivos subidos.";
    contenedor.appendChild(p);
    return;
  }

  archivos.forEach((f, i) => {
    const item = document.createElement("div");
    item.className = "archivo-item";

    const nombre = document.createElement("p");
    nombre.textContent = f.name;

    const verBtn = document.createElement("button");
    verBtn.textContent = "📄 Ver PDF";
    verBtn.classList.add("btn-ver");
    verBtn.addEventListener("click", () => {
      const newTab = window.open();
      newTab.document.write(`<iframe src="${f.data}" width="100%" height="100%" style="border:none;"></iframe>`);
    });

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.classList.add("btn-eliminar");
    eliminarBtn.addEventListener("click", () => {
      if (confirm(`¿Eliminar ${f.name}?`)) {
        borrarArchivo(semana, i);
        renderLista(semana, contenedor);
      }
    });

    item.appendChild(nombre);
    item.appendChild(verBtn);
    item.appendChild(eliminarBtn);
    contenedor.appendChild(item);
  });
}

// Eliminar un archivo específico
function borrarArchivo(semana, index) {
  const archivos = JSON.parse(localStorage.getItem(`semana_${semana}`)) || [];
  archivos.splice(index, 1);
  localStorage.setItem(`semana_${semana}`, JSON.stringify(archivos));
}
