const item = document.getElementsByClassName('item')[0];

const productArticleElt = document.createElement('article');

const str = document.location.href;
const url = new URL(str);
const id = url.searchParams.get('id');
const productUrl = `http://localhost:3000/api/products/${id}`;

getProduct();

async function getProduct() {
    const resp = await fetch(productUrl);
    const respData = await resp.json();
    showProduct(respData);
}

function showProduct(product) {
    const { _id, colors, name, price, imageUrl, description, altTxt } = product;
    let cart;
    if (JSON.parse(localStorage.getItem('products')) != null) {
        cart = new Map(Object.entries(JSON.parse(localStorage.getItem('products'))));
        console.log('Map après LS: ');
        console.log(cart);
    }
    else {
        cart = new Map();
    }

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
    colors.forEach((color) => {
        productArticleElt.querySelector('#colors').appendChild(getColor(color));
    })
    item.appendChild(productArticleElt);

    function getColor(color) {
        const colorsElt = document.createElement('option');
        colorsElt.value = color;
        colorsElt.innerHTML =
            `
                ${color}
            `
        return colorsElt;
    }

    productArticleElt.querySelector('#addToCart').addEventListener('click', () => {
        if(((productArticleElt.querySelector('#colors').value) != '') 
        && ((productArticleElt.querySelector('#quantity').value > 0) && (productArticleElt.querySelector('#quantity').value <= 100))) {
            if((cart.get(`${_id}_${productArticleElt.querySelector('#colors').value}`) != undefined) && (cart.get(`${_id}_${productArticleElt.querySelector('#colors').value}`).color == productArticleElt.querySelector('#colors').value)) {
                cart.set(`${_id}_${cart.get(`${_id}_${productArticleElt.querySelector('#colors').value}`).color}`, {id: _id, color: productArticleElt.querySelector('#colors').value, quantity: parseInt(cart.get(`${_id}_${productArticleElt.querySelector('#colors').value}`).quantity, 10) + parseInt(productArticleElt.querySelector('#quantity').value, 10)});
                console.log('Map avant LS: ');
                console.log(cart);
            }
            else {
                cart.set(`${_id}_${productArticleElt.querySelector('#colors').value}`, {id: _id, color: productArticleElt.querySelector('#colors').value, quantity: parseInt(productArticleElt.querySelector('#quantity').value, 10)});
                console.log('Map avant LS: ');
                console.log(cart);
            }
            localStorage.setItem('products', JSON.stringify(Object.fromEntries(cart)));
            console.log('Object dans LS: ' + JSON.stringify(Object.fromEntries(cart)));

            alert('Article(s) ajouté(s) au panier !');
        }
        else {
            alert('Veuillez choisir une couleur et une quantité valide.')
        }
    })
}