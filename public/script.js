let cart = JSON.parse(localStorage.getItem("cart")) || [];
let userName = localStorage.getItem("userName") || "";
let userLocation = localStorage.getItem("userLocation") || "";

// 🔥 LIVE BASE URL
const BASE_URL = "https://local-market-wr0w.onrender.com";

// PRODUCTS
const products = [
  {name:"Samosa",price:20,img:"images/fig1.jpg"},
  {name:"Rasgulla",price:30,img:"images/fig2.jpg"},
  {name:"Paneer",price:150,img:"images/fig3.jpg"},
  {name:"Paratha",price:50,img:"images/fig4.jpg"},
  {name:"Chole Bhature",price:80,img:"images/fig5.jpg"},
  {name:"Biryani",price:120,img:"images/fig6.jpg"},
  {name:"Lassi",price:40,img:"images/fig7.jpg"},
];

// RENDER
function render(list = products) {
  const box = document.getElementById("products");
  box.innerHTML = "";

  list.forEach(p => {
    box.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <div class="card-body">
          <h4>${p.name}</h4>
          <p>₹${p.price}</p>
          <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
        </div>
      </div>`;
  });
}

// SEARCH
document.getElementById("search").addEventListener("input", e => {
  const v = e.target.value.toLowerCase();
  render(products.filter(p => p.name.toLowerCase().includes(v)));
});

// CART
function addToCart(name, price) {
  cart.push({ name, price });
  saveData();
  updateCart();
}

function updateCart() {
  document.getElementById("cartCount").innerText = cart.length;

  let html = "", total = 0;

  cart.forEach((it, i) => {
    total += it.price;
    html += `
      <div class="cart-item">
        ${it.name} ₹${it.price}
        <button onclick="removeItem(${i})">❌</button>
      </div>`;
  });

  document.getElementById("cartItems").innerHTML =
    html || "<p>Your cart is empty 🛒</p>";

  document.getElementById("total").innerText = total;

  localStorage.setItem("cartTotal", total);
}

function removeItem(i) {
  cart.splice(i, 1);
  saveData();
  updateCart();
}

function toggleCart() {
  document.getElementById("cartDrawer").classList.toggle("open");
}

// ORDER REDIRECT
function placeOrder() {
  if (!userName) return openModal("loginModal");
  if (!userLocation) return openModal("locationModal");

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "order.html";
}

// 🔥 LOGIN API
async function submitLogin(){
  let email = document.getElementById("email").value;

  if(!email.includes("@")){
    alert("Enter valid email");
    return;
  }

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if(data.success){
    userName = email;
    localStorage.setItem("userName", email);

    document.getElementById("userText").innerText = email;
    closeModal("loginModal");
  }
}

// GOOGLE LOGIN
function googleLogin(){
  let email = prompt("Enter your email");

  if(!email || !email.includes("@")){
    alert("Invalid email");
    return;
  }

  localStorage.setItem("userName", email);
  document.getElementById("userText").innerText = email;
}

// 🔥 LOCATION
async function saveLocation() {
  let loc = document.getElementById("locationInput").value;
  if (!loc) return;

  userLocation = loc;
  localStorage.setItem("userLocation", loc);

  document.getElementById("locText").innerText = loc;
  closeModal("locationModal");

  await fetch(`${BASE_URL}/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: userName,
      location: loc
    })
  });
}

// GEO LOCATION
function useCurrentLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    let loc = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
    document.getElementById("locationInput").value = loc;
  });
}

// MODAL
function openModal(id) {
  document.getElementById(id).style.display = "block";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// SAVE
function saveData() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// SECTION
function showSection(type){
  const box = document.getElementById("sectionBox");

  if(type === "profile"){
    box.innerHTML = `
      <h3>👤 User Profile</h3>
      <p>Logged in as <b>${userName || "Guest"}</b></p>
      <p><b>Location:</b> ${userLocation || "Not Set"}</p>
    `;
  }
  if(type === "contact"){
    box.innerHTML = `
      <h3>📞 Contact</h3>
      <p>Phone: 9876543210</p>
      <p>Email: support@localmarket.com</p>
    `;
  }

  if(type === "about"){
    box.innerHTML = `
      <h3>ℹ️ About Us</h3>
      <p>We support small vendors by bringing their products online.</p>
    `;
  }

  if(type === "privacy"){
    box.innerHTML = `
      <h3>🔒 Privacy Policy</h3>
      <p>Your data is safe with us.</p>
    `;
  }

  box.scrollIntoView({ behavior: "smooth" });
}

// INIT
updateCart();
render();

if (userName) document.getElementById("userText").innerText = userName;
if (userLocation) document.getElementById("locText").innerText = userLocation;