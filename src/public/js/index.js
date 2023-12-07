const socket = io()

const form = document.querySelector('#form');
const productsContainer = document.querySelector('.active-products-container');
const uploadBtn = document.querySelector('#upload-btn');

const getProductsFetch = ()=>{
    fetch('/api/products?limit=100')
    .then(res => res.json())
    .then(data => {
        const reverseData = data.message.docs.reverse();
        let products = '';
        reverseData.forEach(prod => {
            products += `
            <div class="active-product">
                <h2>${prod.title}</h2>
                <p><strong>Description:</strong> ${prod.description}</p>
                <p><strong>Price:</strong> ${prod.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                <p><strong>Code:</strong> ${prod.code}</p>
                <p><strong>Stock:</strong> ${prod.stock}</p> 
                <p><strong>Category:</strong> ${prod.category}</p>
                <p><strong>Status:</strong> ${prod.status}</p>
                <p><strong>Img:</strong> ${prod.thumbnail && 'img-' + prod.title}</p>
                <p><strong>ID:</strong> ${prod._id}</p>
                <button class="delete-btn" onClick="deleteBtn('${prod._id}')">Delete</button>
            </div>`
        });
        productsContainer.innerHTML = products
    })
}
getProductsFetch()

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const dataForm = new FormData(e.target)
    const newProduct = Object.fromEntries(dataForm)
    socket.emit('newProduct', newProduct)
    form.reset()
})

const deleteBtn = (id)=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to delete this product?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(id)
            socket.emit('deleteProduct', id)
            socket.on('productDeleted', async (confirm)=>{
                if(confirm){
                    getProductsFetch()
                    Swal.fire(
                        'Deleted!',
                        'Your product has been deleted.',
                        'success'
                    )
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'The product could not be deleted.'
                    })
                }
            });
        }
    })
}

socket.on('products', (product)=>{
    if(product){
        Swal.fire({
            position: 'center center',
            icon: 'success',
            title: 'Your product has been added!',
            showConfirmButton: false,
            timer: 1500
        })
        getProductsFetch()
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'The product could not be added.'
        })
    }
})