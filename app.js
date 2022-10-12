const cards = document.getElementById("cards");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
const tituloProducto = templateCard.querySelector("h4");
const precioProducto = templateCard.getElementById("precio");
const imagenProducto = templateCard.querySelector("img");
const boton = templateCard.querySelector("button");
let carrito = {};
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const items = document.getElementById("items");
const footer = document.getElementById("footer");

document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();

    // Para guardar lo productos en el navegador al recargar:
    
  if(localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito"))
    pintarCarrito()
  }

});

items.addEventListener("click", (e) => {
  btnAccion(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCards = (data) => {
  data.forEach((e) => {
    tituloProducto.textContent = e.title;
    precioProducto.textContent = e.precio
    imagenProducto.setAttribute("src", e.thumbnailUrl);
    boton.dataset.id = e.id;

    const clone = templateCard.cloneNode(true);

    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

cards.addEventListener("click", (e) => addCarrito(e));

const addCarrito = (e) => {
  if (e.target.classList.contains("btn")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (obj) => {
  const producto = {
    id: obj.querySelector(".btn").dataset.id,
    titulo: obj.querySelector("h4").textContent,
    precio: obj.querySelector("#precio").textContent,
    cantidad: 1
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = { ...producto };

  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    // console.log(producto);
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.titulo;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-suma").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-resta").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  pintarFooter();

  // Para guardar lo productos en el navegador al recargar:

  localStorage.setItem("carrito", JSON.stringify(carrito))
};

const pintarFooter = () => {
  footer.innerHTML = ``;
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  // console.log(nCantidad);
  // console.log(nPrecio);

  templateFooter.querySelector("td").textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAccion = (e) => {
  if (e.target.classList.contains("btn-suma")) {
    const productoBtn = carrito[e.target.dataset.id];
    productoBtn.cantidad++;
    carrito[e.target.dataset.id] = { ...productoBtn };
    pintarCarrito();

  } else if (e.target.classList.contains("btn-resta")) {
    const productoBtn = carrito[e.target.dataset.id];
    productoBtn.cantidad--;
    if (productoBtn.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito()
  }
  e.stopPropagation();
};
