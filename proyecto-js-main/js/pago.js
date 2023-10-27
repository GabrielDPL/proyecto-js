document.addEventListener("DOMContentLoaded", function () {
    //subtotal que viene del archivo carrito.js
    document.getElementById("subtotal").textContent = calcularTotalCarrito();
    
    //evento para que se modifique el html al cambiar el select sin que haya un error primero
    document.getElementById("metodo-envio").addEventListener("change", calcularEnvio);
    document.getElementById("metodo-pago").addEventListener("change", validarPago);

    //funcion para validar el formulario 
    validarFormulario();
});

//funcion para validar todos los campos del formulario antes de su envio
function validarFormulario() {
    document.getElementById("form-carrito").addEventListener("submit", function (e) {
        e.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let email = document.getElementById("email").value;
        let telefono = document.getElementById("telefono").value;
        let direccion = document.getElementById("direccion").value;
        let codPostal = document.getElementById("cod-postal").value;
        let provincia = document.getElementById("provincia").value;
        let localidad = document.getElementById("localidad").value;
        let metodoEnvio = document.getElementById("metodo-envio").value;
        let metodoPago = document.getElementById("metodo-pago").value;

        if (nombre == "" || email == "" || telefono == "" || direccion == "" || codPostal == "" || codPostal.length != 4 || provincia == "" || localidad == "" || metodoEnvio == "defecto" || metodoPago == "defecto") {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                text: 'Por favor, completa todos los campos correctamente.',
                confirmButtonColor: "#444444"
            });
        } else if ((metodoPago == "debito" || metodoPago == "credito") && (document.getElementById("num-tarjeta").value == "" || document.getElementById("num-tarjeta").value.length != 16 || document.getElementById("cod-seguridad").value == "" || document.getElementById("cod-seguridad").value.length != 3)) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                text: 'Por favor, completa los campos de tarjeta correctamente.',
                confirmButtonColor: "#444444"
            });
        } else {
            // Una vez que se validan los datos los guardo en un objeto
            let datosCompra = {
                nombre: nombre,
                email: email,
                telefono: telefono,
                direccion: direccion,
                codPostal: codPostal,
                provincia: provincia,
                localidad: localidad,
                metodoEnvio: metodoEnvio,
                metodoPago: metodoPago,
                numTarjeta: document.getElementById("num-tarjeta").value,
                codSeguridad: document.getElementById("cod-seguridad").value
            };

            // Convierto el objeto a formato JSON para poder enviarlo
            let datosCompraJSON = JSON.stringify(datosCompra);

            // Función para simular la subida de los datos a una API utilizando fetch
            enviarDatos(datosCompraJSON);
        }
    });
}

// Función que calcula el costo de envío en función de la opción seleccionada por el usuario
function calcularEnvio() {
    let envio;
    let metodoEnvio = document.getElementById("metodo-envio").value;

    switch (metodoEnvio) {
        case "caba":
            envio = 800;
            break;
        case "gba":
            envio = 1100;
            break;
        case "interior":
            envio = 2500;
            break;
        case "retiro":
            envio = 0;
            break;
        default:
            envio = 0;
    }

    document.getElementById("envio").textContent = envio;
    document.getElementById("total").textContent = calcularTotalCompra(envio);
}

// Función para calcular el total de la compra sumando el total del carrito y el envío
function calcularTotalCompra(envio) {
    let total = 0;
    for (const producto of carrito) {
        total += producto.precio * producto.cantidad;
    }
    return total + envio;
}

// Función para validar la opción elegida como método de pago
function validarPago() {
    let metodoPago = document.getElementById("metodo-pago").value;
    let pagoTarjeta = document.getElementById("pago-tarjeta");
    let errorNumTarjeta = document.getElementById("error-numtarj");
    let errorCodSeguridad = document.getElementById("error-codseg");

    if (metodoPago === "debito" || metodoPago === "credito") {
        pagoTarjeta.style.display = "block";
        errorNumTarjeta.style.display = "none";
        errorCodSeguridad.style.display = "none";
    } else {
        pagoTarjeta.style.display = "none";
        errorNumTarjeta.style.display = "none";
        errorCodSeguridad.style.display = "none";
    }
}

// Función que simula la subida de los datos a una API utilizando fetch
function enviarDatos(datos) {
    const URLPOST = "https://jsonplaceholder.typicode.com/posts";

    fetch(URLPOST, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: datos
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: '¡Compra confirmada!',
            text: 'Vas a recibir un mail de confirmación con el detalle de la compra en tu casilla',
            confirmButtonColor: "#444444"
        });
        vaciarCarrito();
        document.querySelectorAll(".entrada-pago").forEach(input => input.value = '');
        document.getElementById("metodo-envio").value = "defecto";
        document.getElementById("metodo-pago").value = "defecto";
    })
    .catch(error => {
        console.error("Error al enviar datos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error en la compra',
            text: 'Ha ocurrido un error al procesar la compra. Por favor, inténtalo nuevamente más tarde.',
            confirmButtonColor: "#444444"
        });
    });
}

function vaciarCarrito() {
    document.getElementById("gastoTotal").textContent = "Total: $0";
    document.getElementById("cantidad-compra").textContent = "0";
    let tablaCarrito = document.querySelectorAll(".tabla-carrito");
    tablaCarrito.forEach(fila => fila.remove());
    localStorage.clear();
    carrito = [];
}
