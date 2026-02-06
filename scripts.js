/**
 * SISTEMA DE REGISTRO DE USUARIOS
 * Aplicación de lineamientos de codificación segura.
 */

(function() {
    "use strict";

    // Arreglo privado (no expuesto en window)
    let registros = [];
    let contador = 0;

    // Conjuntos de caracteres válidos (Regex)
    const VALIDACIONES = {
        texto: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/,
        telefono: /^[0-9]{10}$/,
        curp: /^[A-Z]{4}[0-9]{6}[H,M][A-Z]{5}[A-Z0-9]{2}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };

    /**
     * Muestra mensajes genéricos al usuario sin revelar detalles técnicos.
     */
    function mostrarMensajeUsuario(esError) {
        const alerta = document.getElementById('mensajeError');
        if (esError) {
            alerta.textContent = "La información ingresada no es válida o el sistema no está disponible. Verifique sus datos.";
            alerta.classList.remove('d-none');
        } else {
            alerta.classList.add('d-none');
        }
    }

    /**
     * Valida cada campo contra el conjunto de caracteres permitidos.
     */
    function validarEntradas(datos) {
        if (!VALIDACIONES.texto.test(datos.nombre)) return false;
        if (!VALIDACIONES.texto.test(datos.apellido1)) return false;
        if (!VALIDACIONES.telefono.test(datos.telefono)) return false;
        if (!VALIDACIONES.curp.test(datos.curp)) return false;
        if (!VALIDACIONES.email.test(datos.email)) return false;
        return true;
    }

    function guardarRegistro() {
        // Obtención de datos
        const nombre = document.getElementById('nombre').value.trim();
        const apellido1 = document.getElementById('apellido1').value.trim();
        const apellido2 = document.getElementById('apellido2').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const curp = document.getElementById('curp').value.trim().toUpperCase();
        const email = document.getElementById('email').value.trim();

        const datosParaValidar = { nombre, apellido1, telefono, curp, email };

        // 1. Validación de entrada (Whitelist)
        if (!validarEntradas(datosParaValidar)) {
            mostrarMensajeUsuario(true);
            return;
        }

        mostrarMensajeUsuario(false);

        // 2. Construcción de objeto seguro (sin API Keys ni tokens quemados)
        const nuevoRegistro = {
            id: ++contador,
            nombreCompleto: `${nombre} ${apellido1} ${apellido2}`.trim(),
            telefono: telefono,
            curp: curp,
            email: email,
            fechaRegistro: new Date().toISOString()
        };

        registros.push(nuevoRegistro);
        agregarFilaTabla(nuevoRegistro);
        
        document.getElementById('registroForm').reset();

        // 3. Envío seguro (el endpoint y tokens deben ser manejados por el servidor o variables de entorno)
        enviarAServidor(nuevoRegistro);
    }

    function agregarFilaTabla(registro) {
        const tabla = document.getElementById('tablaRegistros');
        const fila = document.createElement('tr');

        // Uso de textContent para prevenir ataques XSS (no usar innerHTML con datos de usuario)
        const campos = ['nombreCompleto', 'telefono', 'curp', 'email'];
        campos.forEach(campo => {
            const celda = document.createElement('td');
            celda.textContent = registro[campo];
            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
    }

    function enviarAServidor(datos) {
        // En producción, esta URL se obtiene de una configuración segura del lado del servidor
        // No se exponen IPs ni tokens en el cliente.
    }

    // Inicialización
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('registroForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                guardarRegistro();
            });
        }
    });

})();