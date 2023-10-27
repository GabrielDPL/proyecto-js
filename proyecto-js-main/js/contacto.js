document.addEventListener('DOMContentLoaded', function () {
    validarDatosContacto();
});

function validarDatosContacto() {
    const formContacto = document.getElementById('form-contacto');

    formContacto.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre-contacto').value;
        const email = document.getElementById('email-contacto').value;
        const telefono = document.getElementById('telefono-contacto').value;
        const mensaje = document.getElementById('mensaje-contacto').value;

        if (!nombre || !email || !telefono || !mensaje) {
            return;
        }

        const datosContacto = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            mensaje: mensaje
        };

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosContacto)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}
