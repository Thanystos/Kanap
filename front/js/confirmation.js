const str = document.location.href;
const url = new URL(str);
const id = url.searchParams.get('orderId');
const orderId = document.getElementById('orderId');

orderId.innerHTML = id;