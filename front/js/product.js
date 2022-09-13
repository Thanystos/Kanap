const item = document.getElementsByClassName('item')[0];

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
    const { colors, name, price, imageUrl, description, altTxt } = product;
    console.log(product);

    const productArticleElt = document.createElement('article');
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
        </div>
        <div class="item__content__addButton">
            <button id="addToCart">
                Ajouter au panier
            </button>
        </div>
    </div>
    `
    colors.forEach((color) => {
        productArticleElt.querySelector('#colors').appendChild(getColor(color));
    })
    item.appendChild(productArticleElt);
}

function getColor(color) {
    const colorsElt = document.createElement('option');
    colorsElt.value = color;
    colorsElt.innerHTML =
        `
            ${color}
        `
    return colorsElt;
}