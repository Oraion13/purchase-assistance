const add = document.getElementById("add");
const purchase_type = document.getElementById("purchase_type");
const purchase_from = document.getElementById("purchase_from");
const purchase_to= document.getElementById("purchase_to");
const department = document.getElementById("department");
const purchase_name = document.getElementById("purchase_name");
const purchase_purpose = document.getElementById("purchase_purpose");
const is_consumable = document.getElementById("is_consumable");
const is_below = document.getElementById("is_below");
const table_purchase = document.getElementById("table_purchase");
const search_purchase = document.getElementById("search_purchase");
const alert = document.querySelector(".alert");

function delete_item(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  if (window.confirm("Are you sure to delete?")) {
    table_purchase.removeChild(element);

    // remove from local storage
    delete_purchase(id);
  }
}

// !!!Alert!!!
function display_alert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 4000);
}

// Delete purchase by ID
const delete_purchase = (id) => {
  const xhr = new XMLHttpRequest();

  xhr.open("DELETE", `../api/purchase/purchases.php?ID=${id}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        display_alert("item removed", "danger");
        remove_from_local_storage(id);
      }
    }
  };

  xhr.send();
};

// Table display
const setup_purchase_table = () => {
  table_purchase.innerHTML = `
  <tr>
            <th>PurchaseId</th>
            <th>Type</th>
            <th>Purpose</th>
        </tr>`;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `../api/purchase/purchases.php`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.setItem("purchases", JSON.stringify(got));
        append_purchase(got);
      }
    }
  };

  xhr.send();
};

// edit files
function edit_item(e) {
  // console.log("he");
  e.preventDefault();
  const element = e.currentTarget.parentElement.parentElement;
  // console.log(element);
  const id = element.dataset.id;
  const ab = element.dataset.ab;

  const xhr = new XMLHttpRequest();

  xhr.open("GET", `../api/purchase/purchases.php?ID=${id}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.setItem("purchase", JSON.stringify(got));
        if (got.is_below == 1) {
          window.location.replace("./below/below.html");
        } else {
          window.location.replace("./above/above.html");
        }
      }
    }
  };

  xhr.send();
}

const append_purchase = (got) => {
  // console.log(got);
  got.forEach((item) => {
    const element = document.createElement("tr");
    let attr = document.createAttribute("data-id");
    attr.value = item.purchase_id;
    let ab = document.createAttribute("data-ab");
    ab.value = item.is_below;

    element.setAttributeNode(attr);
    element.setAttributeNode(ab);

    element.innerHTML = `
    <td>${item.purchase_type}/${item.purchase_year}/${item.department}/${
      item.purchase_name
    }</td>
    <td>${item.is_consumable == 1 ? "Consumable" : "Non-Consumable"}</td>
    <td>${item.purchase_purpose}</td>
    <td><button type="button" class="delete-btn btn btn-danger">
    <i class="fas fa-trash"></i>
  </button></td>
  <td><button type="button" class="edit-btn btn btn-warning">
  <i class="fas fa-edit"></i>
</button></td>
    `;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", delete_item);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", edit_item);

    table_purchase.appendChild(element);
  });
};

// ------------------------------------- Filter ---------------------------------- //
// get from local storage
const get_purchase = () => {
  return window.localStorage.getItem("purchases")
    ? JSON.parse(window.localStorage.getItem("purchases"))
    : [];
};

// filter search purchase
function filter_purchase(e) {
  const got = get_purchase();

  table_purchase.innerHTML = `
  <tr>
            <th>PurchaseId</th>
            <th>Type</th>
            <th>Purpose</th>
        </tr>
  `;

  append_purchase(
    got.filter((item) => item.purchase_name.includes(search_purchase.value))
  );
}

// remove from local storage
function remove_from_local_storage(id) {
  let items = get_purchase();

  items = items.filter((item) => {
    if (item.purchase_id != id) {
      return item;
    }
  });

  window.localStorage.setItem("purchases", JSON.stringify(items));
}

// -------------------------------------- POST --------------------------------- //
// submit form
function submit_form(e) {
  console.log("hello");
  e.preventDefault();

  const purchase = {
    purchase_type: purchase_type.value,
    purchase_from: purchase_from.value,
    purchase_to: purchase_to.value,
    department: department.value,
    purchase_name: purchase_name.value,
    purchase_purpose: purchase_purpose.value,
    is_consumable: is_consumable.value,
    is_below: is_below.value,
  };

  const xhr = new XMLHttpRequest();

  xhr.open("POST", `../api/purchase/purchases.php`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.alert("purchase added successfully");
        setup_purchase_table();
        purchase_type.value = "";
        purchase_from.value = "";
        purchase_to.value = "";
        department.value = "";
        purchase_name.value = "";
        purchase_purpose.value = "";
        is_consumable.value = "";
        is_below.value = "";
      }
    }
  };

  xhr.send(JSON.stringify(purchase));
}

function initialize() {
  setup_purchase_table();
}
// initially
window.addEventListener("DOMContentLoaded", initialize);
// search bar
search_purchase.addEventListener("keyup", filter_purchase);
add.addEventListener("click", submit_form);
