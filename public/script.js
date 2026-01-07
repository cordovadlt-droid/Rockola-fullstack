// ANTES: const API_URL = "http://localhost:5500/api/canciones";
const API_URL = "/api/canciones"; // AHORA: Ruta relativa para que funcione en Vercel

// 1. Cargar canciones al iniciar
async function cargarCanciones() {
    try {
        const res = await fetch(API_URL);
        const canciones = await res.json();
        const tbody = document.getElementById('tabla-body');
        
        tbody.innerHTML = '';

        canciones.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.autor}</td>
                    <td>${c.letra}</td>
                    <td>${c.pais_origen || '---'}</td>
                    <td>
                        <button class="btn-edit" onclick="prepararEdicion(${c.id}, '${c.autor}', '${c.letra}', '${c.pais_origen}', '${c.fecha_lanzamiento}')">✏️ Editar</button>
                        <button class="btn-delete" onclick="eliminar(${c.id})">🗑️ Borrar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

// 2. Procesar Formulario (POST o PATCH)
async function procesarFormulario() {
    const id = document.getElementById('edit-id').value;
    const data = {
        autor: document.getElementById('autor').value,
        letra: document.getElementById('letra').value,
        pais_origen: document.getElementById('pais').value,
        fecha_lanzamiento: document.getElementById('fecha').value
    };

    if (!data.autor || !data.letra) {
        alert("Por favor completa Autor y Letra");
        return;
    }

    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PATCH' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        cancelarEdicion();
        cargarCanciones();
    } catch (error) {
        console.error("Error al guardar:", error);
    }
}

// 3. Eliminar canción
async function eliminar(id) {
    if (!confirm("¿Deseas eliminar esta canción?")) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarCanciones();
    } catch (error) {
        console.error("Error al borrar:", error);
    }
}

// 4. Preparar Edición con Scroll Suave
function prepararEdicion(id, autor, letra, pais, fecha) {
    // Llenar campos
    document.getElementById('edit-id').value = id;
    document.getElementById('autor').value = autor;
    document.getElementById('letra').value = letra;
    document.getElementById('pais').value = (pais !== 'null' && pais !== 'undefined') ? pais : '';
    
    if (fecha && fecha !== 'null' && fecha !== 'undefined') {
        document.getElementById('fecha').value = fecha.split('T')[0]; 
    }

    // Cambiar títulos
    document.getElementById('form-title').innerText = "📝 Editando Canción #" + id;
    document.getElementById('btn-cancelar').style.display = "inline-block";

    // Ir al formulario con scroll suave
    const contenedor = document.getElementById('form-container');
    if (contenedor) {
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Efecto visual de resalte
        contenedor.style.transition = "0.5s";
        contenedor.style.boxShadow = "0 0 25px rgba(26, 115, 232, 0.5)";
        setTimeout(() => {
            contenedor.style.boxShadow = "";
        }, 1500);
    }
}

// 5. Cancelar edición
function cancelarEdicion() {
    document.getElementById('edit-id').value = '';
    document.querySelectorAll('input').forEach(i => i.value = '');
    document.getElementById('form-title').innerText = "Agregar Nueva Canción";
    document.getElementById('btn-cancelar').style.display = "none";
}

cargarCanciones();