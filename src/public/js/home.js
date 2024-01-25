const productsContainer = document.querySelector('.product-container');

const addToCart = (prod_id)=>{
    fetch('/api/session/verifyToken', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        fetch(`/api/carts/${data.user.user.cart}/products/${prod_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({quantity: 1})
        })
        .then(res => {
            if(!res.ok){
                throw new Error('Error al agregar el producto al carrito');
            }
            Swal.fire({
                title: "Product added to the cart",
                icon: "success"
            });
        })
        .catch(error => {
            Swal.fire({
                title: "Error!",
                icon: "error"
            });
        });
    })
    .catch(error => {
        console.error('Error al verificar el token:', error);
    });
}

const getProductsFetch = ()=>{
    fetch('/api/products/')
    .then(res => res.json())
    .then(data => {
        const reverseData = data.message.docs.reverse();
        let products = '';
        reverseData.forEach(prod => {
            products += `
            <div class="product">
                <h2>${prod.title}</h2>
                <span>${prod.price}</span>
                <span>Stock: ${prod.stock}</span>
                <button onClick="addToCart('${prod._id}')">Add to cart<button>
            </div>`
        });
        productsContainer.innerHTML = products
    })
}
getProductsFetch()