document.addEventListener("DOMContentLoaded", function () {
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach(header => {
        header.addEventListener("click", function () {
            const body = this.nextElementSibling;
            const isActive = body.classList.contains("active");

            // Cierra el acordeón si está abierto
            if (isActive) {
                body.classList.remove("active");
                body.style.maxHeight = null;
            } else {
                // Cierra todos los demás acordeones antes de abrir el actual
                const activeBodies = document.querySelectorAll(".accordion-body.active");
                activeBodies.forEach(activeBody => {
                    activeBody.classList.remove("active");
                    activeBody.style.maxHeight = null;
                });

                // Abre el acordeón actual
                body.classList.add("active");
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
});
