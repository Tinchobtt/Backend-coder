const productsContainer = document.querySelector('.product-container');

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
            </div>`
        });
        productsContainer.innerHTML = products
    })
}
getProductsFetch()