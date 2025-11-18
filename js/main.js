const txtName = document.getElementById("Name");
const txtNumber = document.getElementById("Number");
const btnAgregar = document.getElementById("btnAgregar");
const btnClear = document.getElementById("btnClear");  // ← actualizado
const alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
const alertValidaciones = document.getElementById("alertValidaciones");
const contadorProductos = document.getElementById("contadorProductos");
const productosTotal = document.getElementById("productosTotal");
const precioTotal = document.getElementById("precioTotal");
const tablaListaCompras = document.getElementById("tablaListaCompras");
const cuerpoTabla = tablaListaCompras.getElementsByTagName("tbody").item(0);

let cont = 0;
let totalEnProductos = 0;
let costoTotal = 0;
let datos = new Array();

function validarCantidad(cantidad) {
    if (cantidad.length == 0) return false;
    if (isNaN(cantidad)) return false;
    if (Number(cantidad) <= 0) return false;
    return true;
}

function getPrecio() {
    return Math.round(Math.random() * 10000) / 100;
}

btnAgregar.addEventListener("click", function (event) {
    event.preventDefault();
    let isValid = true;
    txtName.style.border = "";
    txtNumber.style.border = "";
    alertValidacionesTexto.innerHTML = "";
    alertValidaciones.style.display = "none";

    if (txtName.value.length < 3) {
        txtName.style.border = "solid medium red";
        alertValidacionesTexto.innerHTML =
            "<strong>El nombre del producto no es correcto</strong><br/>";
        alertValidaciones.style.display = "block";
        isValid = false;
    }

    if (!validarCantidad(txtNumber.value)) {
        txtNumber.style.border = "solid medium red";
        alertValidacionesTexto.innerHTML += "<strong>La cantidad no es correcta</strong>";
        alertValidaciones.style.display = "block";
        isValid = false;
    }

    if (isValid) {
        let precio = getPrecio();
        cont++;

        let row = `<tr>
                    <td>${cont}</td>
                    <td>${txtName.value}</td>
                    <td>${txtNumber.value}</td>
                    <td>${precio}</td>
                   </tr>`;

        let elemento = {
            "cont": cont,
            "nombre": txtName.value,
            "cantidad": txtNumber.value,
            "precio": precio
        };

        datos.push(elemento);
        localStorage.setItem("datos", JSON.stringify(datos));

        totalEnProductos += Number(txtNumber.value);
        costoTotal += precio * Number(txtNumber.value);

        cuerpoTabla.insertAdjacentHTML("beforeend", row);
        contadorProductos.innerText = cont;
        productosTotal.innerText = totalEnProductos;
        precioTotal.innerText = new Intl.NumberFormat("es-MX",
            { style: "currency", currency: "MXN" }).format(costoTotal);

        let resumen = {
            "cont": cont,
            "totalEnProductos": totalEnProductos,
            "costoTotal": costoTotal
        };

        localStorage.setItem("resumen", JSON.stringify(resumen));

        txtName.value = "";
        txtNumber.value = "";
        txtName.focus();
    }
});

window.addEventListener("load", function (event) {
    event.preventDefault();

    if (localStorage.getItem("datos") != null) {
        datos = JSON.parse(localStorage.getItem("datos"));
        datos.forEach((e) => {
            let row = `<tr>
                <td>${e.cont}</td>
                <td>${e.nombre}</td>
                <td>${e.cantidad}</td>
                <td>${e.precio}</td>
               </tr>`;
            cuerpoTabla.insertAdjacentHTML("beforeend", row);
        });
    }

    if (localStorage.getItem("resumen") != null) {
        let resumen = JSON.parse(localStorage.getItem("resumen"));
        cont = resumen.cont;
        totalEnProductos = resumen.totalEnProductos;
        costoTotal = resumen.costoTotal;
    }

    contadorProductos.innerText = cont;
    productosTotal.innerText = totalEnProductos;
    precioTotal.innerText = new Intl.NumberFormat("es-MX",
        { style: "currency", currency: "MXN" }).format(costoTotal);
});

// ------------------ CLEAR ------------------

btnClear.addEventListener("click", function (event) {
    event.preventDefault();

    txtName.value = "";
    txtNumber.value = "";

    txtName.style.border = "";
    txtNumber.style.border = "";
    alertValidacionesTexto.innerHTML = "";
    alertValidaciones.style.display = "none";

    cuerpoTabla.innerHTML = "";

    contadorProductos.innerText = 0;
    productosTotal.innerText = 0;
    precioTotal.innerText = "$0.00";

    cont = 0;
    totalEnProductos = 0;
    costoTotal = 0;
    datos = [];

    localStorage.clear();
});
