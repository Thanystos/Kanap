const items = document.getElementById('items');

getProducts();

// Appel de l'API afin d'obtenir tous les produits
async function getProducts() {
    const resp = await fetch('http://localhost:3000/api/products/');
    const respData = await resp.json();
    showProducts(respData);
}

// Affichage des informations des produits disponibles
function showProducts(products) {
    products.forEach((product) => {
        const { _id, altTxt, description, imageUrl, name } = product;  // Les éléments sélectionnés
        
        // Construction de mes blocs html en y intégrant les données récupérées via l'API
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