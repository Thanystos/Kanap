const cart = new Map(Object.entries(JSON.parse(localStorage.getItem('products'))));

const cartElt = document.getElementsByClassName('cart')[0];
const cartPriceElt = document.getElementsByClassName('cart__price')[0];
const totalPriceElt = document.getElementById('totalPrice');
const productSectionElt = document.createElement('section');
productSectionElt.id = 'cart__items';

let totalPrice = 0;

cart.forEach((value) => {
    const id = value.id;
    const color = value.color;
    const quantity = value.quantity;
    getProduct(id, color, quantity);
});

async function getProduct(id, color, quantity) {
    const resp = await fetch(`http://localhost:3000/api/products/${id}`);
    const respData = await resp.json();
    showProduct(respData, id, color, quantity);
}

function showProduct(product, id, color, quantity) {
    const { name, price, imageUrl, altTxt } = product;
    const realPrice = price / 100;
    const frenchColor = defineFrenchColor(color);
    totalPrice += (realPrice * quantity);


    productSectionElt.innerHTML += `
        <article class="cart__item" data-id="${id}" data-color="${color}">
            <div class="cart__item__img">
                <img src="${imageUrl}" alt="${altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${name}</h2>
                    <p>${frenchColor}</p>
                    <p>${realPrice} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
    `
    cartElt.insertBefore(productSectionElt, cartPriceElt);
}

function defineFrenchColor(color) {
    switch(color) {
        case 'Blue':
            return 'Bleu';
        case 'White':
            return 'Blanc';
        case 'Black':
            return 'Noir';
        case 'Black/Yellow':
            return 'Noir/Jaune';
        case 'Black/Red':
            return 'Noir/Rouge';
        case 'Green':
            return 'Vert';
        case 'Red':
            return 'Rouge';
        case 'Pink':
            return 'Rose';
        case 'Grey':
            return 'Gris';
        case 'Purple':
            return 'Violet';
        case 'Navy':
            return 'Bleu marine';
        case 'Silver':
            return 'Argenté';
        case 'Brown':
            return 'Marron';
        case 'Yellow':
            return 'Jaune';
        default:
            return 'Orange';
    }
}
function displayPrice() {
    totalPriceElt.innerHTML = totalPrice;
}
setTimeout(displayPrice, 200);  // Besoin de retarder l'affichage le temps que la fonction asynchrone finisse son travail
