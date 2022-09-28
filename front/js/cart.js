const cart = new Map(Object.entries(JSON.parse(localStorage.getItem('products'))));

const cartElt = document.getElementsByClassName('cart')[0];
const cartPriceElt = document.getElementsByClassName('cart__price')[0];
const totalQuantityElt = document.getElementById('totalQuantity');
const totalPriceElt = document.getElementById('totalPrice');
const productSectionElt = document.createElement('section');
productSectionElt.id = 'cart__items';

let totalQuantity = 0;
let totalPrice = 0;

let suppress;

let formInputs = [
    {
        formElt: 'firstName',
        pattern: /^[a-z ,.'-]+$/i
    },

    {
        formElt: 'lastName',
        pattern: /^[a-z ,.'-]+$/i
    },

    {
        formElt: 'address',
        pattern: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i
    },

    {
        formElt: 'city',
        pattern: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i
    },

    {
        formElt: 'email',
        pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i
    }
]
let valid = new Set();
const submitElt = document.getElementById('order');

console.log(cart);

requests();

// Besoin de retarder l'affichage le temps que la fonction asynchrone finisse son travail
setTimeout(displayPrice, 100*cart.size);
setTimeout(setEvents, 100*cart.size);

// Appel de l'API pour chacun des produits du panier
async function requests() {
    for (value of cart) {  // Toujours utiliser for of pour boucler sur des fonctions asynchrones JAMAIS FOREACH !!!!!
        await getInfos(value);
    }
}

// Obtention à partir du LS les informations importantes à l'identification du produit et au calcul de son prix total
async function getInfos(value) {
    const id = value[1].id;
    const color = value[1].color;
    const quantity = value[1].quantity;

    await getProduct(id, color, quantity);
}

// Appel de l'API afin d'obtenir le produit désigné par son id
async function getProduct(id, color, quantity) {
    const resp = await fetch(`http://localhost:3000/api/products/${id}`);
    const respData = await resp.json();
    showProduct(respData, id, color, quantity);
}

// Affichage des informations du produit
function showProduct(product, id, color, quantity) {
    const { name, price, imageUrl, altTxt } = product;
    const realPrice = price / 100;
    const frenchColor = defineFrenchColor(color);

    totalQuantity += quantity;
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
                    <p class="realPrice">${realPrice} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p class="realPrice">Qté : </p>
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

// Permet de traduire le nom des couleurs en français
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

// Affiche à l'endroit approprié la quantité d'articles et le montant total de notre panier
function displayPrice() {
    totalQuantityElt.innerHTML = totalQuantity;
    totalPrice = totalPrice.toFixed(2);
    totalPriceElt.innerHTML = totalPrice;
}

// Se charge d'appeler l'intégralité des fonctions qui concernent les events
function setEvents() {
    setNewQuantityEvent();
    setDeleteEvent();
    formInputs.forEach((value) => {
        setInputEvent(value.formElt, value.pattern);
    });
    setSubmitEvent();
}

// Se charge de gérer l'event qui se déclenche lors de la modification de la quantité d'un article dans le panier
function setNewQuantityEvent() {
    const allQuantitySelectorElt = productSectionElt.querySelectorAll('.itemQuantity');
    allQuantitySelectorElt.forEach((quantitySelectorElt) => {
        quantitySelectorElt.addEventListener('change', (e) => {
            suppress = false;
            modifyLS(quantitySelectorElt, e, suppress);
            recalculateTotal(e);
        });
    });
}

// Se charge de gérer l'évent qui se déclenche lors de la suppression d'un article dans le panier
function setDeleteEvent() {
    const allDeleteSelectorElt = productSectionElt.querySelectorAll('.deleteItem');
    allDeleteSelectorElt.forEach((deleteSelectorElt) => {
        deleteSelectorElt.addEventListener('click', (e) => {
            suppress = true;
            modifyLS(deleteSelectorElt, e, suppress);
            deleteSelectorElt.closest('article').remove();
            recalculateTotal(e);
        });
    });
}

// Permet lors de la modification du panier, de faire évoluer le local storage de manière à ce qu'il reste représentatif du nouveau contenu
function modifyLS(SelectorElt, e, suppress) {
    if(!suppress) {
        const identifier = getIdentifier(SelectorElt);
        cart.get(identifier).quantity = parseInt(e.target.value, 10);
        console.log(cart);
        localStorage.setItem('products', JSON.stringify(Object.fromEntries(cart)));
    }
    else {
        const identifier = getIdentifier(SelectorElt);
        cart.delete(identifier);
        console.log(cart);
        localStorage.setItem('products', JSON.stringify(Object.fromEntries(cart)));
    }
}

// Permet de repérer le produit en cours de modification ou de suppression
function getIdentifier(quantitySelector) {
    const id = quantitySelector.closest('article').attributes[1].value;
    const color = quantitySelector.closest('article').attributes[2].value;
    const identifier = id + '_' + color;
    return identifier;
}

// Si le LS est mis à jour, recalcule le montant total et la quantité d'articles
function recalculateTotal(e) {
    let price;
    
    if((e.target.value <= 0) || (e.target.value > 100)) {
        alert('Quantité invalide !');
    }
    else {
        totalQuantity = 0;
        totalPrice = 0;
        let index = 1;
        cart.forEach((value) => {
            let articlePos = document.querySelector(`article:nth-of-type(${index})`);
            console.log(articlePos);
            price = parseFloat(articlePos.querySelector('.realPrice').innerHTML, 10);
            console.log(price + ' * ' + value.quantity);

            totalQuantity += value.quantity;
            totalPrice += (price * value.quantity);
            console.log('AddingPrice : ' + totalPrice);
            index++;
        });
        totalQuantityElt.innerHTML = totalQuantity;
        totalPrice = totalPrice.toFixed(2);
        totalPriceElt.innerHTML = totalPrice;
    } 
}

// Gère les events liés à l'entrée utilisateur au niveau du formulaire de contact
function setInputEvent(id, pattern) {
    const elt = document.getElementById(id);
    
    elt.addEventListener('input', () => {
        if(elt.value.match(pattern)) {
            document.getElementById(`${id}ErrorMsg`).innerHTML = '';
            valid.add(id);
        }
        else {
            valid.delete(id);
            switch(id) {
                case 'firstName':
                   document.getElementById(`${id}ErrorMsg`).innerHTML = 'Votre prénom est invalide, n\'utilisez uniquement que des lettres';
                   break;
                case 'lastName':
                    document.getElementById(`${id}ErrorMsg`).innerHTML = 'Votre prénom est invalide, n\'utilisez uniquement que des lettres';
                    break;
                case 'address':
                    document.getElementById(`${id}ErrorMsg`).innerHTML = 'Adresse inexistante !';
                    break;
                case 'city':
                    document.getElementById(`${id}ErrorMsg`).innerHTML = 'Ville inexistante !';
                    break;
                case 'email':
                    document.getElementById(`${id}ErrorMsg`).innerHTML = 'Format d\'email invalide !';
                    break;
            }
        }
    });
}

// Gère la validation du formulaire et envoie les données de contact et de numéro de commande à l'API puis redirige vers la page de confirmation
function setSubmitEvent() {
    let order;
    
    submitElt.addEventListener('click', (e) => {
        let productsId = [];

        e.preventDefault();

        for(value of cart) {
            productsId.push(value[1].id);
        }
        
        if((valid.size == 5) && (productsId.length != 0)) {
            order = {
                contact: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    email: document.getElementById('email').value
                },
                products: productsId
            };

            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.clear();
                    window.location.href = "confirmation.html?orderId=" + data.orderId;
                })
                .catch(err => console.log(err))
        }
        else {
            if(productsId.length == 0) {
                alert('Panier vide !');
            }
            else {
                alert('Veuillez remplir correctement le formulaire !');
            }
        }
    })
}