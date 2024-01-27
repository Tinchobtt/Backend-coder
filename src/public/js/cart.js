const productsContainer = document.querySelector('.cart-products')
const clearCartBtn = document.querySelector('.clearCartBtn')

const checkToken = async () => {
    try {
        const response = await fetch('/api/session/verifyToken', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!data) return null;
        return data;
    } catch (error) {
        return null;
    }
}

const fetchProducts = async () => {
    try {
        const data = await checkToken();

        if (!data) {
            productsContainer.innerHTML = '';
        } else {
            const response = await fetch(`/api/carts/${data.user.user.cart}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const prods = await response.json();

            let products = '';
            prods.message.products.forEach(prod => {
                products += `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display:flex; flex-direction: column;">
                            <h2>${prod.id_prod.title}</h2>
                            <span>Price: ${prod.id_prod.price}</span>
                            <span>Quantity: ${prod.quantity}</span>
                        </div>
                        <button onClick="deleteProductFromCart('${data.user.user.cart}', '${prod.id_prod._id}')">Delete</button>
                    </div>
                    <hr style="margin: 1rem 0">
                `;
            });
            productsContainer.innerHTML = products;
        }
    } catch (error) {
        console.log(error);
    }
}
fetchProducts();

const deleteProductFromCart = async (idCart, idProd) => {
    try {
        const response = await fetch(`/api/carts/${idCart}/products/${idProd}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        fetchProducts();
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};


clearCartBtn.addEventListener('click', async () => {
    try {
        const data = await checkToken();
        if (data) {
            const response = await fetch(`/api/carts/${data.user.user.cart}/clearCart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al vaciar el carrito');
            }

            Swal.fire({
                title: "Cart empty",
                icon: "success"
            });
            fetchProducts();
        }
    } catch (error) {
        Swal.fire({
            title: "Error!",
            icon: "error"
        });
    }
});
