const productsContainer = document.querySelector('.cart-products')

const fetchProducts = ()=> {
    fetch('/api/session/verifyToken', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        fetch(`/api/carts/${data.user.user.cart}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(prods => {
            let products = ''
            prods.message.products.forEach(prod => {
                products += `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display:flex; flex-direction: column;">
                            <h2>${prod.id_prod.title}</h2>
                            <span>Price: ${prod.id_prod.price}</span>
                            <span>Quantity: ${prod.quantity}</span>
                        </div>
                        <button onClick="deleteProductFromCart('${prod._id}', '${prod.id_prod._id}')">Delete</button>
                    </div>
                    <hr style="margin: 1rem 0">
                `
            });
            productsContainer.innerHTML = products
        })
        .catch(error => {
            console.log(error);
        });
    })
}
fetchProducts()

const deleteProductFromCart = (idCart, idProd) => {
    // fetch(`/api/carts/${idCart}/${idProd}`, {
    //     method: 'delete',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // })
}

const clearCart = () => {

}