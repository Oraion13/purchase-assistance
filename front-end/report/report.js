const consumable_table_body = document.getElementById("consumable_table_body");
const non_consumable_table_body = document.getElementById(
  "non_consumable_table_body"
);

// get from local storage
const get_user = () => {
  return window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : [];
};

// --------------------------------------------- Setup ----------------------------------------------//
// setup sapdlam la

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
    <td>${item.purchase_type}/${item.purchase_from} - ${item.purchase_to}/${
      item.department
    }/${item.purchase_name}</td>
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

    if (item.is_consumable == 1) {
      consumable_table_body.appendChild(element);
    } else {
      non_consumable_table_body.appendChild(element);
    }
  });
};

// Table display
const setup_purchase_table = () => {
  non_consumable_table_body.innerHTML = ``;
  consumable_table_body.innerHTML = ``;

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

// --------------------------------------------- Initially --------------------------------------------- //

// initially check logged in or not
window.addEventListener("DOMContentLoaded", () => {
  if (!get_user().admin_id) {
    window.location.replace("../index.html");
  }

  setup_purchase_table();
});
