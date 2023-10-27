document.addEventListener("DOMContentLoaded", function () {
  let carrito = cargarCarrito();
  let productosJSON = [];
  let cantidadTotalCompra = carrito.length;

  document.getElementById("cantidad-compra").textContent = cantidadTotalCompra;

  document.getElementById("seleccion").addEventListener("change", ordenarProductos);

  fetch("../json/productos.json")
    .then(response => response.json())
    .then(data => {
      productosJSON = data;
      renderizarProductos();
    })
    .catch(error => {
      console.error("Error al cargar el archivo JSON:", error);
    });

  document.getElementById("btn-continuar").addEventListener('click', function (e) {
    if (carrito.length === 0) {
      e.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'No hay ningún artículo en tu carrito',
        text: 'Agrega algún producto para continuar',
        confirmButtonColor: "#444444"
      });
    }
  });

  function renderizarProductos() {
    const productosContainer = document.getElementById("section-productos");

    for (const producto of productosJSON) {
      const productoDiv = document.createElement("div");
      productoDiv.className = "card-product";
      productoDiv.innerHTML = `<div class="img-container">
                              <img src="${producto.foto}" alt="${producto.nombre}" class="img-product"/>
                            </div>
                            <div class="info-producto">
                              <p class="font">${producto.nombre}</p>
                              <strong class="font">$${producto.precio}</strong>
                              <button class="botones" id="btn${producto.id}"> Agregar al carrito </button>
                            </div>`;

      productosContainer.appendChild(productoDiv);

      document.getElementById(`btn${producto.id}`).addEventListener('click', function () {
        agregarAlCarrito(producto);
      });
    }
  }

  function ordenarProductos() {
    const seleccion = document.getElementById("seleccion").value;

    if (seleccion === "menor") {
      productosJSON.sort((a, b) => a.precio - b.precio);
    } else if (seleccion === "mayor") {
      productosJSON.sort((a, b) => b.precio - a.precio);
    } else if (seleccion === "alfabetico") {
      productosJSON.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    const productosContainer = document.getElementById("section-productos");
    productosContainer.innerHTML = "";
    renderizarProductos();
  }

  class ProductoCarrito {
    constructor(prod) {
      this.id = prod.id;
      this.foto = prod.foto;
      this.nombre = prod.nombre;
      this.precio = prod.precio;
      this.cantidad = 1;
    }
  }

  function agregarAlCarrito(productoAgregado) {
    let encontrado = carrito.find(p => p.id == productoAgregado.id);
    if (encontrado === undefined) {
      let productoEnCarrito = new ProductoCarrito(productoAgregado);
      carrito.push(productoEnCarrito);
      Swal.fire({
        icon: 'success',
        title: 'Nuevo producto agregado al carrito',
        text: productoAgregado.nombre,
        confirmButtonColor: "#444444"
      });

      const tablaBody = document.getElementById("tablabody");
      const nuevaFila = document.createElement("tr");
      nuevaFila.id = `fila${productoEnCarrito.id}`;
      nuevaFila.className = "tabla-carrito";
      nuevaFila.innerHTML = `<td>${productoEnCarrito.nombre}</td>
                            <td id='${productoEnCarrito.id}'>${productoEnCarrito.cantidad}</td>
                            <td>${productoEnCarrito.precio}</td>
                            <td><button class='btn btn-light' id="eliminar${productoEnCarrito.id}">🗑️</button></td>`;

      tablaBody.appendChild(nuevaFila);

      document.getElementById(`eliminar${productoEnCarrito.id}`).addEventListener("click", function () {
        let eliminado = carrito.findIndex(p => p.id == productoEnCarrito.id);
        carrito.splice(eliminado, 1);
        nuevaFila.remove();
        document.getElementById("gastoTotal").textContent = `Total: $ ${calcularTotalCarrito()}`;
        localStorage.setItem("carrito", JSON.stringify(carrito));
      });
    } else {
      let posicion = carrito.findIndex(p => p.id == productoAgregado.id);
      carrito[posicion].cantidad += 1;
      document.getElementById(`${productoAgregado.id}`).textContent = carrito[posicion].cantidad;
    }

    document.getElementById("gastoTotal").textContent = `Total: $ ${calcularTotalCarrito()}`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarEnTabla();
  }

  function mostrarEnTabla() {
    const tablaBody = document.getElementById("tablabody");
    tablaBody.innerHTML = "";
    for (const prod of carrito) {
      const nuevaFila = document.createElement("tr");
      nuevaFila.id = `fila${prod.id}`;
      nuevaFila.className = "tabla-carrito";
      nuevaFila.innerHTML = `<td>${prod.nombre}</td>
                            <td id='${prod.id}'>${prod.cantidad}</td>
                            <td>${prod.precio}</td>
                            <td><button class='btn btn-light' id="eliminar${prod.id}">🗑️</button></td>`;

      tablaBody.appendChild(nuevaFila);

      document.getElementById(`eliminar${prod.id}`).addEventListener("click", function () {
        let eliminado = carrito.findIndex(p => p.id == prod.id);
        carrito.splice(eliminado, 1);
        nuevaFila.remove();
        document.getElementById("gastoTotal").textContent = `Total: $ ${calcularTotalCarrito()}`;
        localStorage.setItem("carrito", JSON.stringify(carrito));
      });
    }
  }

  function calcularTotalCarrito() {
    let total = 0;
    for (const producto of carrito) {
      total += producto.precio * producto.cantidad;
    }
    document.getElementById("montoTotalCompra").textContent = total;
    document.getElementById("cantidad-compra").textContent = carrito.length;
    return total;
  }

  function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    if (carrito === null) {
      return [];
    } else {
      return carrito;
    }
  }
})
