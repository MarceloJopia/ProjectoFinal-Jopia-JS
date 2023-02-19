const productos = [
    {nombre: "Nintendo Switch", valor: 300000, stock: 17, id: "1", categoria:["nintendo","consolas"]},
    {nombre: "Playstation 5", valor: 800000, stock: 15 , id: "2", categoria:["ps","consolas"]},
    {nombre: "Xbox Series X", valor: 550000, stock: 12 , id: "3", categoria:["xbox","consolas"]},
    {nombre: "Pokemon Escarlata", valor: 55000, stock: 7, id: "4", categoria:["nintendo"]},
    {nombre: "Mario Party", valor: 55000, stock: 22, id: "5", categoria:["nintendo"]},
    {nombre: "God of War Ragnarok (PS5)", valor: 65000, stock: 13, id: "6", categoria:["consolas"]},
    {nombre: "Halo Infinite (XBOX)", valor: 50000, stock: 3, id: "7", categoria:["xbox"]},
    {nombre: "Switch Controller (Control Nintendo)", valor: 90000, stock: 29, id: "8", categoria:["nintendo","otros"]},
    {nombre: "Control Xbox", valor: 35000, stock: 24, id: "9", categoria:["xbox","otros"]},
    {nombre: "Elden Ring (PC)", valor: 45000, stock: 7, id: "10", categoria:["pc"]},
    {nombre: "Elden Ring (PS5)", valor: 55000, stock: 10, id: "11", categoria:["ps"]},
    {nombre: "Catan - El Juego", valor: 25000, stock: 15, id: "12", categoria:["mesa"]}
]

Swal.fire({
    title: 'Error!',
    text: 'Do you want to continue',
    icon: 'error',
    confirmButtonText: 'Cool'
  })

dibujarCatalogo(productos)

const filtros = {pc:false, nintendo:false, ps:false, xbox:false, mesa:false, consolas:false, otros:false}

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

function dibujarCarrito(){
    const listaCarrito = document.querySelector('.listaCarrito')
    console.log(listaCarrito)
    let productosCarrito = JSON.parse(localStorage.getItem('carrito'))
    console.log(productosCarrito)
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
        total=total+precio
    }
    calcTotal.innerHTML = 'Total: '+total+' CLP'
    console.log(calcTotal)

}