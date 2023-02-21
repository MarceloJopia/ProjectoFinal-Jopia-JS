// Array de obj (listo)
// Funciones y condicionales (listo)
// Dom y eventos (listo)
// Sintaxis avanzada (?)
// Uso de 1 libreria pequeña (X)
// Promesas con "FETCH"
// cargar datos desde JSON [local] o desde una API (listo)
//
//
//
let productos
const filtros = {pc:false, nintendo:false, ps:false, xbox:false, mesa:false, consolas:false, otros:false}

fetch('/proyectoFinal/js/productos.json')
    .then ((resp) => resp.json())
    .then( (data) => {
        productos = data
        dibujarCatalogo(productos)
        console.log(data)
    })

    
let checkboxList = document.querySelectorAll(".checkboxFiltros")
checkboxList.forEach((checkbox)=>{
    checkbox.addEventListener('change', ()=>{
        console.log(checkbox.name)
        const checkboxName = checkbox.name
        filtros[checkboxName] = checkbox.checked
        console.log(filtros)
        const productosFiltrados = filtrarProductos()
        if (productosFiltrados.length == 0){
            dibujarCatalogo(productos)
        }
        else{
            dibujarCatalogo(productosFiltrados)
        }
    })
})

dibujarCarrito()
calcTotal()


function filtrarProductos(){
    const productosFiltrados = []
    productos.forEach((producto)=>{
        producto.categoria.forEach((categoria)=>{
            if(filtros[categoria]===true){
                productosFiltrados.push(producto)
            }
        })
    })
    return productosFiltrados
}

function dibujarCatalogo(listaProductos){
    const catalogo = document.querySelector(".catalogo")
    catalogo.innerHTML=''
    for (let cardProducto of listaProductos){
        const nombreProducto = document.createElement("b")
        const stockProducto = document.createElement("p")
        const precioProducto = document.createElement("p")
        const btnAgregarCarrito = document.createElement("button")
        const card = document.createElement("div")
        card.classList.add("card")
        nombreProducto.innerHTML = cardProducto.nombre
        stockProducto.innerHTML = "Stock Disponible: "+cardProducto.stock
        precioProducto.innerHTML = "Precio: "+cardProducto.valor+" CLP"
        btnAgregarCarrito.innerHTML = "<b>Agregar</b>"
        btnAgregarCarrito.className = "anadirCarrito"
        card.appendChild(nombreProducto)
        card.appendChild(stockProducto)
        card.appendChild(precioProducto)
        card.appendChild(btnAgregarCarrito)
        catalogo.appendChild(card)
    }
    activarEventoBoton(listaProductos)
}

function activarEventoBoton(listaProductos){
    const botonesProductos = document.querySelectorAll('.anadirCarrito')
    botonesProductos.forEach((boton, index)=>{
        boton.addEventListener('click',()=>{
            agregarCarrito(listaProductos[index])
            Toastify({
                text: "Se ha agregado al Carrito",
                duration: 4000,
                destination: "#carrito",
                newWindow: false,
                close: true,
                gravity: "bottom",
                position: "right",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){}
              }).showToast();
        })
    })
    console.log({botonesProductos})
}

function agregarCarrito(item){
    let carrito = []
    const carritoCreado = localStorage.getItem('carrito')
    if(!carritoCreado){
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }
    else{
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
    carrito.push(item)
    localStorage.setItem('carrito', JSON.stringify(carrito))
    console.log(carrito)
}

function dibujarCarrito(){
    const listaCarrito = document.querySelector('.listaCarrito')
    console.log(listaCarrito)
    let productosCarrito = JSON.parse(localStorage.getItem('carrito'))
    if (!productosCarrito){
        localStorage.setItem('carrito', JSON.stringify([]))
        productosCarrito=[]
    }
    if(productosCarrito.length===0){
        const card = document.createElement("div")
        const nombreProducto = document.createElement("p")
        card.classList.add("cardCarrito")
        nombreProducto.innerHTML = "No hay productos en tu carrito"
        card.appendChild(nombreProducto)
        listaCarrito.appendChild(card)  
    }    
    else{
        for(let producto of productosCarrito){
            const nombreProducto = document.createElement("b")
            const stockProducto = document.createElement("p")
            const precioProducto = document.createElement("p")
            const card = document.createElement("div")
            card.classList.add("cardCarrito")
            nombreProducto.innerHTML = producto.nombre
            stockProducto.innerHTML = "Stock Disponible: "+producto.stock
            precioProducto.innerHTML = "Precio: "+producto.valor+" CLP"
            card.appendChild(nombreProducto)
            card.appendChild(stockProducto)
            card.appendChild(precioProducto)
            listaCarrito.appendChild(card)
        }  
    }
    console.log(productosCarrito)
}

function calcTotal(){
    const calcTotal = document.querySelector('.precioTotal')
    let productosSeleccionados = JSON.parse(localStorage.getItem('carrito'))
    const preciosSeleccionados = []
    productosSeleccionados.forEach((producto)=>{
        console.log(producto.valor)
        preciosSeleccionados.push(producto.valor)
    })
    let total = Number()
    for(let precio of preciosSeleccionados){
        total+=precio
    }
    calcTotal.innerHTML = 'Total: '+total+' CLP'
    console.log(calcTotal)
}

// Alertas realizar compra o compra fallida

// Swal.fire({
//     title: 'Tu compra se realizo Correctamente',
//     icon: 'success',
//     confirmButtonText: 'Volver'
//   })


//   Swal.fire({
//     title: 'No se pudo realizar tu compra',
//     text: 'Revisa que todo este correcto o contactanos',
//     icon: 'error',
//     confirmButtonText: 'Volver'
//   })