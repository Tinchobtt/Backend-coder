const infoCompraContainer = document.querySelector('.info-compra')

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

const purchase = async () => {
    try{
        const data = await checkToken()
        if(data){
            const response = await fetch(`/api/carts/${data.user.user.cart}/purchase`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
                throw new Error('Error al finalizar la compra.');
            }
            const ticket = await response.json();
            infoCompraContainer.innerHTML = `
                <span style="margin-bottom: 1rem">Precio: ${ticket.message.amount}</span>
                <span style="margin-bottom: 1rem">Codigo de compra: ${ticket.message.code}</span>
                <span style="margin-bottom: 1rem">Fecha: ${ticket.message.purchase_datetime}</span>
                <a href="/static/home" style="text-decoration: none; color: blue">Volver a Home</a>
            `
        }
    }catch(error){
        console.log(error);
    }
}

purchase()