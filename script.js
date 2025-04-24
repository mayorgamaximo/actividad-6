/* Funcion para generar una nueva clave */
function crearClave() {
    const largo = parseInt(document.getElementById("tam").value);
    const incluirMayus = document.getElementById("mayus").checked;
    const incluirNum = document.getElementById("num").checked;
    const incluirSimbolos = document.getElementById("simbolos").checked;
    let base = "abcdefghijklmnopqrstuvwxyz";
    if (incluirMayus) base += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (incluirNum) base += "0123456789";
    if (incluirSimbolos) base += "!@#$%^&*()_+";
    let resultado = "";
    for (let i = 0; i < largo; i++) {
        resultado += base.charAt(Math.floor(Math.random() * base.length));
    }
    document.getElementById("claveGenerada").value = resultado;

    añadirHistorial(resultado);
}

/* Array para almacenar el historial de contraseñas */
let historialContraseñas = [];
/* Cantidad de items por pagina en el historial */
const itemsPorPagina = 5;
/* Pagina actual del historial */
let paginaActual = 1;

/* Funcion para agregar una contraseña al historial */
function añadirHistorial(res) {
    historialContraseñas.push(res);
    actualizarHistorialPaginado();
}

/* Funcion para actualizar la visualizacion paginada del historial */
function actualizarHistorialPaginado() {
    const lista = document.getElementById("contraseñas");
    const historialDiv = document.getElementById("historial");
    lista.innerHTML = ""; // Limpiar la lista actual

    const startIndex = (paginaActual - 1) * itemsPorPagina;
    const endIndex = Math.min(startIndex + itemsPorPagina, historialContraseñas.length);

    for (let i = startIndex; i < endIndex; i++) {
        const nuevoLi = document.createElement("li");
        nuevoLi.textContent = historialContraseñas[i];
        lista.appendChild(nuevoLi);
    }

    // Crear o actualizar los botones de paginacion
    const totalPaginas = Math.ceil(historialContraseñas.length / itemsPorPagina);
    if (totalPaginas > 1) {
        let botonesPaginacion = historialDiv.querySelector(".paginacion");
        if (!botonesPaginacion) {
            botonesPaginacion = document.createElement("div");
            botonesPaginacion.classList.add("paginacion");
            historialDiv.appendChild(botonesPaginacion);
        } else {
            botonesPaginacion.innerHTML = ""; // Limpiar contenido existente
        }

        // Crear div para contener los botones
        const botonesContainer = document.createElement("div");
        botonesContainer.classList.add("botones-paginacion");
        botonesPaginacion.appendChild(botonesContainer);

        // Si hay mas de 3 paginas implementar slider de navegacion
        if (totalPaginas > 3) {
            // Boton anterior
            const botonAnterior = document.createElement("button");
            botonAnterior.textContent = "«";
            botonAnterior.classList.add("nav-button");
            botonAnterior.addEventListener("click", () => {
                if (paginaActual > 1) {
                    paginaActual--;
                    actualizarHistorialPaginado();
                }
            });
            botonesContainer.appendChild(botonAnterior);

            // Determinar que botones mostrar
            let startPage = Math.max(1, paginaActual - 1);
            let endPage = Math.min(startPage + 2, totalPaginas);

            // Ajustar startPage si estamos cerca del final
            if (endPage === totalPaginas) {
                startPage = Math.max(1, totalPaginas - 2);
            }

            // Crear botones visibles
            for (let i = startPage; i <= endPage; i++) {
                const boton = document.createElement("button");
                boton.textContent = i;
                boton.addEventListener("click", () => {
                    paginaActual = i;
                    actualizarHistorialPaginado();
                });
                if (i === paginaActual) {
                    boton.classList.add("activo");
                }
                botonesContainer.appendChild(boton);
            }

            // Boton siguiente
            const botonSiguiente = document.createElement("button");
            botonSiguiente.textContent = "»";
            botonSiguiente.classList.add("nav-button");
            botonSiguiente.addEventListener("click", () => {
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    actualizarHistorialPaginado();
                }
            });
            botonesContainer.appendChild(botonSiguiente);

            // Añadir indicador de pagina actual/total
            const paginaInfo = document.createElement("span");
            paginaInfo.classList.add("pagina-info");
            paginaInfo.textContent = `${paginaActual} de ${totalPaginas}`;
            botonesPaginacion.appendChild(paginaInfo);
        } else {
            // Para 3 o menos paginas mostrar todos los botones normalmente
            for (let i = 1; i <= totalPaginas; i++) {
                const boton = document.createElement("button");
                boton.textContent = i;
                boton.addEventListener("click", () => {
                    paginaActual = i;
                    actualizarHistorialPaginado();
                });
                if (i === paginaActual) {
                    boton.classList.add("activo");
                }
                botonesContainer.appendChild(boton);
            }
        }
    } else {
        // Si solo hay una pagina o ninguna eliminar los botones de paginacion si existen
        const botonesPaginacion = historialDiv.querySelector(".paginacion");
        if (botonesPaginacion) {
            botonesPaginacion.remove();
        }
    }
}

/* Evento al hacer click en el boton generar */
document.getElementById("generar").addEventListener("click", crearClave);

/* Evento al hacer click en el boton copiar */
document.getElementById("copiar").addEventListener("click", () => {
    const campo = document.getElementById("claveGenerada");
    campo.select();
    document.execCommand("copy");
    snackbar();
});

/* Evento al cambiar el valor del input de tamaño */
document.getElementById("tam").addEventListener("input", (e) => {
    document.getElementById("tamValor").textContent = e.target.value;
});

/* Funcion para mostrar la notificacion snackbar */
function snackbar() {
    var x = document.getElementById("snackbar");

    x.className = "show";

    setTimeout(function(){ x.className = x.className.replace("show", ""); } , 3000);
 }