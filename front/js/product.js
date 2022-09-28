const item = document.getElementsByClassName('item')[0];

const productArticleElt = document.createElement('article');

// Méthode permettant d'extirper un paramètre d'une URL
const str = document.location.href;
const url = new URL(str);
const id = url.searchParams.get('id');
const productUrl = `http://localhost:3000/api/products/${id}`;

getProduct();

// Appel de l'API afin d'obtenir le produit désigné par son id
async function getProduct() {
    const resp = await fetch(productUrl);
    const respData = await resp.json();
    showProduct(respData);
}

// Affichage des informations du produit
function showProduct(product) {
    const { _id, colors, name, price, imageUrl, description, altTxt } = product;
    let cart;
    // On récupère le contenu du local storage si il existe et on le stocke dans cart
    if (JSON.parse(localStorage.getItem('products')) != null) {
        cart = new Map(Object.entries(JSON.parse(localStorage.getItem('products'))));
        console.log('Map après LS: ');
        console.log(cart);
    }
    // Sinon on crée cart qui accueillera le futur contenu
    else {
        cart = new Map();
    }

    // Construction de mes blocs html en y intégrant les données récupérées via l'API
    productArticleElt.innerHTML = 
    `
        <div class="item__img">
            <img src="${imageUrl}" alt="${altTxt}>
        </div>
        <div class="item__content">
            <div class="item__content__titlePrice">
                <h1 id="title">
                    ${name}
                </h1>
                <p>
                    Prix : 
                    <span id="price">
                        ${price}
                    </span>
                    €
                </p>
            </div>
            <div class="item__content__description">
                <p class="item__content__description__title">
                    Description : 
                </p>
                <p id="description">
                    ${description}
                </p>
            </div>
            <div class="item__content__settings">
                <div class="item__content_settings_color">
                    <label for="color-select">
                        Choisir une couleur :
                    </label>
                    <select id="colors" name="color-select">
                            <option value="">
                                -- SVP, choisissez une couleur --
                            </option>
                    </select>
                </div>
            <div class="item__content__settings__quantity">
            <label for="itemQuantity">
                Nombre d'article(s) (1-100) :
            </label>
            <input id="quantity" type="number" name="itemQuantity" min="1" max="100" value="0">
        </div>
        <div class="item__content__addButton">
            <button id="addToCart">
                Ajouter au panier
            </button>
        </div>
    `

    const colorsElt = productArticleElt.querySelector('#colors');
    const quantityElt = productArticleElt.querySelector('#quantity');

    // Pour chaque couleur récupérée, on créera une option de couleur supplémentaire pour notre select
    colors.forEach((color) => {
        colorsElt.appendChild(getColor(color));
    })
    item.appendChild(productArticleElt);

    function getColor(color) {
        const optionElt = document.createElement('option');
        optionElt.value = color;
        optionElt.innerHTML =
            `
                ${color}
            `
        return optionElt;
    }

    // Au clic sur ajouter au panier
    productArticleElt.querySelector('#addToCart').addEventListener('click', () => {
        // Si la couleur et la quantité sont correctes
        if(((colorsElt.value) != '') && ((quantityElt.value > 0) && (quantityElt.value <= 100))) {
            // Si cette article a déjà été commandé et ai présent dans le panier, on ajoute la quantité si cette dernière n'excède pas 100
            if((cart.get(`${_id}_${colorsElt.value}`) != undefined) && (cart.get(`${_id}_${colorsElt.value}`).color == colorsElt.value)) {
                if((parseInt(cart.get(`${_id}_${colorsElt.value}`).quantity, 10) + parseInt(quantityElt.value, 10)) > 100) {
                    alert('Il n\'est pas possible de commander plus de 100 produits identiques !');
                }
                else {
                    cart.set(`${_id}_${cart.get(`${_id}_${colorsElt.value}`).color}`, {id: _id, color: colorsElt.value, quantity: parseInt(cart.get(`${_id}_${colorsElt.value}`).quantity, 10) + parseInt(quantityElt.value, 10)});
                    console.log('Map avant LS: ');
                    console.log(cart);
                    alert('Article(s) ajouté(s) au panier !');
                }
            }
            else {
                // Sinon si c'est la première fois qu'il apparait dans le panier, on crée une nouvelle entrée pour lui
                cart.set(`${_id}_${colorsElt.value}`, {id: _id, color: colorsElt.value, quantity: parseInt(quantityElt.value, 10)});
                console.log('Map avant LS: ');
                console.log(cart);
                alert('Article(s) ajouté(s) au panier !');
            }
            // Notre contenu de panier est envoyé dans le local storage après avoir été stringifié
            localStorage.setItem('products', JSON.stringify(Object.fromEntries(cart)));
            console.log('Object dans LS: ' + JSON.stringify(Object.fromEntries(cart)));
        }
        else {
            alert('Veuillez choisir une couleur et une quantité valide.')
        }
    })
}