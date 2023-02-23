let productos
const filtros = {pc:false, nintendo:false, ps:false, xbox:false, mesa:false, consolas:false, otros:false}

fetch('/proyectoFinal/js/productos.json')
    .then ((resp) => resp.json())
    .then ((data) => {
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
        filtrarProductos().then((productosFiltrados)=>{
            productosFiltrados.length == 0 ? dibujarCatalogo(productos) : dibujarCatalogo(productosFiltrados)
        }) 
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
    return new Promise ((resolve)=>{
        setTimeout(()=>(resolve(productosFiltrados)),250)
    })
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
        })
    })
    console.log({botonesProductos})
}

function agregarCarrito(item){
    console.log(item, "carrito")
    const carrito = JSON.parse(localStorage.getItem('carrito'))
    const indexEnCarrito = carrito.findIndex(productoCarrito => {
        return productoCarrito.id == item.id
    })
    if(indexEnCarrito<0){
        item.cantidad = 1
        carrito.push(item)
        alertaAgregarCarrito()
    }
    else if (carrito[indexEnCarrito].cantidad<carrito[indexEnCarrito].stock){
        carrito[indexEnCarrito].cantidad++
        alertaAgregarCarrito()
        
    }
    else{
        noHayStock()
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    dibujarCarrito()
}

function quitarCarrito(item){
    console.log(item, "carrito")
    let carrito = JSON.parse(localStorage.getItem('carrito'))
    const indexEnCarrito = carrito.findIndex(productoCarrito => {
        return productoCarrito.id == item.id
    })
    if (carrito[indexEnCarrito].cantidad>1){
        carrito[indexEnCarrito].cantidad--
        alertaQuitarCarrito()
    }
    else{
        carrito = carrito.filter((producto) => producto.id!=item.id)
        alertaQuitarCarrito()
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    dibujarCarrito()
}

function dibujarCarrito(){
    const listaCarrito = document.querySelector('.listaCarrito')
    listaCarrito.innerHTML=""
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
            const cantidadProducto = document.createElement("p")
            const botonSumarCantidad = document.createElement("button")
            const botonRestarCantidad = document.createElement("button")
            const precioProducto = document.createElement("p")
            const card = document.createElement("div")
            card.classList.add("cardCarrito")
            botonRestarCantidad.className="btnCantidadCarrito"
            botonSumarCantidad.className="btnCantidadCarrito"
            cantidadProducto.className="flexProductoCarrito"
            nombreProducto.innerHTML = producto.nombre
            cantidadProducto.innerHTML = "Cantidad Disponible: "+producto.cantidad
            botonSumarCantidad.innerHTML = '+'
            botonRestarCantidad.innerHTML = '-'
            precioProducto.innerHTML = "Precio: "+producto.valor*producto.cantidad+" CLP"
            botonSumarCantidad.addEventListener('click', () => agregarCarrito(producto))
            botonRestarCantidad.addEventListener('click', () => quitarCarrito(producto))
            card.appendChild(nombreProducto)
            card.appendChild(cantidadProducto)
            card.appendChild(precioProducto)
            cantidadProducto.appendChild(botonRestarCantidad)
            cantidadProducto.appendChild(botonSumarCantidad)
            listaCarrito.appendChild(card)
        }  
    }
    calcTotal()
}

function calcTotal(){
    const calcTotal = document.querySelector('.precioTotal')
    let productosSeleccionados = JSON.parse(localStorage.getItem('carrito'))
    const preciosSeleccionados = []
    productosSeleccionados.forEach((producto)=>{
        preciosSeleccionados.push(producto.valor*producto.cantidad)
    })
    let total = Number()
    for(let precio of preciosSeleccionados){
        total+=precio
    }
    calcTotal.innerHTML = 'Total: '+total+' CLP'
}

function alertaAgregarCarrito(){
    Toastify({
        text: "Se ha agregado un producto al Carrito",
        duration: 3500,
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
}

function alertaQuitarCarrito(){
    Toastify({
        text: "Se ha quitado un producto del Carrito",
        duration: 3500,
        destination: "#carrito",
        newWindow: false,
        close: true,
        gravity: "bottom",
        position: "right",
        style: {
          background: "linear-gradient(90deg, rgba(208,56,112,1) 15%, rgba(255,149,0,1) 100%)",
        },
        onClick: function(){}
    }).showToast();
}


function noHayStock(){
    Swal.fire({
        title: 'No hay mas stock de este Producto',
        text: 'Te invitamos a revisar otros de nuestros productos',
        icon: 'error',
        confirmButtonText: 'Volver'
    })
}