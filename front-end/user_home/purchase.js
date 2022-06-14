const table_purchase = document.getElementById("table_purchase");
const search_purchase = document.getElementById("search_purchase");
const alert = document.querySelector(".alert");
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

// Table display
const setup_purchase_table = () => {
  table_purchase.innerHTML = `
  <tr>
            <th>PurchaseId</th>
            <th>Type</th>
            <th>Purpose</th>
        </tr>`;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `../../api/purchase/purchases.php`, true);

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

  xhr.open("GET", `../../api/purchase/purchases.php?ID=${id}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.setItem("purchase", JSON.stringify(got));
        if (got.is_below == 1) {
          window.location.replace("../user/user_below.html");
        } else {
          window.location.replace("../user_above/user_above.html");
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
    <td></td>
  <td><button type="button" class="edit-btn btn btn-warning">
  View</button></td>
    `;
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

function initialize() {
  setup_purchase_table();
}

// initially
window.addEventListener("DOMContentLoaded", initialize);
// search bar
search_purchase.addEventListener("keyup", filter_purchase);
