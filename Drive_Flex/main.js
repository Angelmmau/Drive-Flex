/**
 * DriveFlex - Lógica Cliente (ES6)
 * Módulo: Diseño e Implementación de Páginas Web (DGETI)
 */

document.addEventListener('DOMContentLoaded', () => {
    iniciarMenuHamburguesa();
    iniciarFiltroCatalogo();
    iniciarCotizadorYValidacion();
});

/* ==========================================================================
   1. MENÚ HAMBURGUESA INTERACTIVO (MÓVIL)
   ========================================================================== */
function iniciarMenuHamburguesa() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
        const estaAbierto = mainNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', estaAbierto);
        menuToggle.innerHTML = estaAbierto ? '×' : '☰';
    });
}

/* ==========================================================================
   2. FILTRO INTERACTIVO DEL CATÁLOGO (catalogo.html)
   ========================================================================== */
function iniciarFiltroCatalogo() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const carCards = document.querySelectorAll('.car-card');

    if (filterButtons.length === 0 || carCards.length === 0) return;

    filterButtons.forEach((boton) => {
        boton.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            boton.classList.add('active');

            const categoriaSeleccionada = boton.getAttribute('data-category');

            carCards.forEach((tarjeta) => {
                const categoriaAuto = tarjeta.getAttribute('data-category');
                if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === categoriaAuto) {
                    tarjeta.style.display = 'flex';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   3. COTIZADOR DINÁMICO Y VALIDACIÓN DE FORMULARIO (contacto.html)
   ========================================================================== */
function iniciarCotizadorYValidacion() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return;

    const selectCategoria = document.getElementById('categoria');
    const inputDias = document.getElementById('dias');
    const selectCobertura = document.getElementById('cobertura');

    const resumenVehiculo = document.getElementById('resumenVehiculo');
    const resumenDias = document.getElementById('resumenDias');
    const resumenCobertura = document.getElementById('resumenCobertura');
    const precioTotal = document.getElementById('precioTotal');

    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const inputFecha = document.getElementById('fechaInicio');
    const formFeedback = document.getElementById('formFeedback');

    const hoyISO = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoyISO);

    const formatoMXN = (cantidad) => {
        return cantidad.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
    };

    const calcularCotizacion = () => {
        const tarifaDia = parseFloat(selectCategoria.value) || 0;
        const dias = Math.max(1, parseInt(inputDias.value, 10) || 1);
        const costoCoberturaDia = parseFloat(selectCobertura.value) || 0;

        const subtotalVehiculo = tarifaDia * dias;
        const subtotalCobertura = costoCoberturaDia * dias;
        const total = subtotalVehiculo + subtotalCobertura;

        resumenVehiculo.textContent = `${formatoMXN(tarifaDia)} / día`;
        resumenDias.textContent = dias === 1 ? '1 día' : `${dias} días`;
        resumenCobertura.textContent = formatoMXN(subtotalCobertura);
        precioTotal.textContent = `${formatoMXN(total)} MXN`;
    };

    selectCategoria.addEventListener('change', calcularCotizacion);
    inputDias.addEventListener('input', calcularCotizacion);
    selectCobertura.addEventListener('change', calcularCotizacion);
    calcularCotizacion();

    quoteForm.setAttribute('novalidate', true);

    quoteForm.addEventListener('submit', (evento) => {
        evento.preventDefault();
        limpiarErrores();

        const errores = [];

        if (!selectCategoria.value) {
            errores.push('Selecciona una categoría de vehículo.');
            marcarError(selectCategoria);
        }

        const diasVal = parseInt(inputDias.value, 10);
        if (isNaN(diasVal) || diasVal < 1 || diasVal > 30) {
            errores.push('El número de días debe ser entre 1 y 30.');
            marcarError(inputDias);
        }

        const nombreVal = inputNombre.value.trim();
        if (nombreVal.length < 3) {
            errores.push('Ingresa tu nombre completo (mínimo 3 caracteres).');
            marcarError(inputNombre);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputEmail.value.trim())) {
            errores.push('Ingresa un correo electrónico válido.');
            marcarError(inputEmail);
        }

        const telRegex = /^[0-9]{10}$/;
        if (!telRegex.test(inputTelefono.value.trim())) {
            errores.push('El teléfono debe contener exactamente 10 dígitos numéricos.');
            marcarError(inputTelefono);
        }

        if (!inputFecha.value || inputFecha.value < hoyISO) {
            errores.push('Selecciona una fecha de entrega válida (a partir de hoy).');
            marcarError(inputFecha);
        }

        if (errores.length > 0) {
            formFeedback.className = 'form-feedback error';
            formFeedback.innerHTML = `<strong>Por favor corrige los siguientes campos:</strong><ul>${errores.map((err) => `<li>${err}</li>`).join('')}</ul>`;
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const categoriaTexto = selectCategoria.options[selectCategoria.selectedIndex].text.split('(')[0].trim();
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
            <strong>¡Solicitud registrada con éxito, ${nombreVal}!</strong><br>
            Hemos bloqueado disponibilidad preliminar para un vehículo <strong>${categoriaTexto}</strong> por <strong>${diasVal} día(s)</strong> (${precioTotal.textContent}).<br>
            Enviamos los detalles de confirmación a <strong>${inputEmail.value.trim()}</strong>.
        `;

        quoteForm.reset();
        calcularCotizacion();
    });

    function marcarError(elemento) {
        elemento.classList.add('input-error');
    }

    function limpiarErrores() {
        formFeedback.className = 'form-feedback';
        formFeedback.innerHTML = '';
        quoteForm.querySelectorAll('.input-error').forEach((el) => el.classList.remove('input-error'));
    }
}