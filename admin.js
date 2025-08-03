import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8ciuAyBxAEx29yeK756dhdrKI9ebD9gQ",
  authDomain: "growcart-19ffd.firebaseapp.com",
  databaseURL: "https://growcart-19ffd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "growcart-19ffd",
  storageBucket: "growcart-19ffd.appspot.com",
  messagingSenderId: "373536744308",
  appId: "1:373536744308:web:5e43d8462dcd7f28e08221",
  measurementId: "G-Q4JDQ62CMF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const catInput = document.getElementById("categoryName");
const catBtn = document.getElementById("addCategoryBtn");
const catList = document.getElementById("categoryList");
const catSelect = document.getElementById("productCategory");

catBtn.onclick = () => {
  const name = catInput.value.trim();
  if (name === "") return alert("Enter category name");
  const newCatRef = push(ref(db, "categories"));
  set(newCatRef, { name });
  catInput.value = "";
};

function loadCategories() {
  onValue(ref(db, "categories"), (snapshot) => {
    catList.innerHTML = "";
    catSelect.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const data = child.val();
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <input type="text" value="${data.name}" data-id="${key}" />
        <button onclick="updateCategory('${key}')">Save</button>
        <button onclick="deleteCategory('${key}')">Delete</button>
      `;
      catList.appendChild(div);

      const option = document.createElement("option");
      option.value = key;
      option.textContent = data.name;
      catSelect.appendChild(option);
    });
  });
}
window.updateCategory = (id) => {
  const input = document.querySelector(`input[data-id='${id}']`);
  update(ref(db, "categories/" + id), { name: input.value });
};
window.deleteCategory = (id) => {
  remove(ref(db, "categories/" + id));
};

loadCategories();

// Product
const pName = document.getElementById("productName");
const pPrice = document.getElementById("productPrice");
const pCat = document.getElementById("productCategory");
const pStock = document.getElementById("productStock");
const pTrending = document.getElementById("productTrending");
const pImage = document.getElementById("productImage");
const pPreview = document.getElementById("imagePreview");
const pBtn = document.getElementById("addProductBtn");
const pList = document.getElementById("productList");

pImage.onchange = () => {
  const file = pImage.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => pPreview.src = e.target.result;
    reader.readAsDataURL(file);
  }
};

pBtn.onclick = async () => {
  const name = pName.value.trim();
  const price = parseFloat(pPrice.value);
  const category = pCat.value;
  const stock = parseInt(pStock.value);
  const trending = pTrending.checked;
  const imageFile = pImage.files[0];

  if (!name || isNaN(price) || !category || isNaN(stock) || !imageFile)
    return alert("Fill all fields and select image");

  const imagePath = `products/${Date.now()}_${imageFile.name}`;
  const imgRef = storageRef(storage, imagePath);
  await uploadBytes(imgRef, imageFile);
  const imgUrl = await getDownloadURL(imgRef);

  const newProductRef = push(ref(db, "products"));
  await set(newProductRef, {
    name, price, category, stock, trending, image: imgUrl
  });

  pName.value = pPrice.value = pStock.value = "";
  pTrending.checked = false;
  pImage.value = "";
  pPreview.src = "";
};

function loadProducts() {
  onValue(ref(db, "products"), (snapshot) => {
    pList.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${d.image}" />
        <p><b>${d.name}</b> - ₱${d.price}</p>
        <p>Stock: ${d.stock} | Category: ${d.category} | Trending: ${d.trending ? "Yes" : "No"}</p>
        <button onclick="removeProduct('${id}')">Delete</button>
      `;
      pList.appendChild(div);
    });
  });
}
window.removeProduct = (id) => {
  remove(ref(db, "products/" + id));
};

loadProducts();
