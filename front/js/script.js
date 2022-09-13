const items = document.getElementById('items');

getProducts();

async function getProducts() {
    const resp = await fetch('http://localhost:3000/api/products/');
    const respData = await resp.json();
    showProducts(respData);
}

function showProducts(products) {
    products.forEach((product) => {
        const { _id, altTxt, description, imageUrl, name } = product;
        
        const productLinkElt = document.createElement('a');
        productLinkElt.href = `./product.html?id=${_id}`;
        productLinkElt.innerHTML = `
            <article>
                <img src="${imageUrl}" alt="${altTxt}">
                <h3 class="productName">${name}</h3>
                <p class="description">${description}<p>
            </article>
        `
        items.appendChild(productLinkElt);
    });
}