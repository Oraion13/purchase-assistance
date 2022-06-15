const consumable_table_body = document.getElementById("consumable_table_body");
const non_consumable_table_body = document.getElementById(
  "non_consumable_table_body"
);
const purchase_from = document.getElementById("purchase_from");
const purchase_to = document.getElementById("purchase_to");
const department = document.getElementById("department");
const search_purchase = document.getElementById("search_purchase");

// get from local storage
const get_user = () => {
  return window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : [];
};

// get purchases
const get_purchases = () => {
  return window.localStorage.getItem("purchases")
    ? JSON.parse(window.localStorage.getItem("purchases"))
    : [];
};

// Helpers
const strcmp = (a, b) => {
  return a < b ? -1 : a > b ? 1 : 0;
};

// Date to month-year
const month_year = (db_date) => {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var now = new Date(db_date);
  return months[now.getMonth()] + "-" + now.getFullYear();
};

// --------------------------------------------- Setup ----------------------------------------------//

// View item when clicked
function view_item(e) {
  const element = e.currentTarget.parentElement.parentElement;
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
        if (ab == 1) {
          window.location.replace("../below/below.html");
        } else {
          window.location.replace("../above/above.html");
        }
      }
    }
  };

  xhr.send();
}

// setup sapdlam la

const append_purchase = (got) => {
  consumable_table_body.innerHTML = ``;
  non_consumable_table_body.innerHTML = ``;
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
    
    <td>${item.purchase_name}</td>
    <td>${month_year(item.purchase_from)} - ${month_year(item.purchase_to)}</td>
    <td>${item.department}</td>
    <td>${item.purchase_purpose}</td>
    <td>${item.purchase_type}</td>
    <td>${item.is_below == 1 ? "Below 50,000" : "Above 50,000"}</td>
  <td><button type="button" class="edit-btn btn btn-warning">
  View
</button></td>
    `;

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", view_item);

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

// -------------------------------------------- Filter ----------------------------------------------- //
function filter_item(e) {
  e.preventDefault();

  if (!purchase_from.value || !purchase_to.value) {
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `../../api/purchase/purchases.php?from=${purchase_from.value}&to=${purchase_to.value}`,
    true
  );

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
}

// filter by department
function filter_by_dept(e) {
  e.preventDefault();

  const purchases = get_purchases();

  if (strcmp(department.value, "all") == 0) {
    append_purchase(purchases);
    return;
  }
  append_purchase(
    purchases.filter((item) =>
      strcmp(item.department, department.value) == 0 ? true : false
    )
  );
}
// --------------------------------------------- Initially --------------------------------------------- //

// initially check logged in or not
window.addEventListener("DOMContentLoaded", () => {
  if (!get_user().admin_id) {
    window.location.replace("../index.html");
  }

  setup_purchase_table();
});

// Buttons for filter
search_purchase.addEventListener("click", filter_item);
department.addEventListener("change", filter_by_dept);
// generate report pdf
document.getElementById("generate_report").addEventListener("click", () => {
  window.jsPDF = window.jspdf.jsPDF;
  const doc = new window.jspdf.jsPDF();
  const doc1 = new window.jspdf.jsPDF();

  doc.autoTable({
    html: "#consumable_table",
    theme: "grid",
    bodyStyles: { lineColor: [255, 255, 255] },
    startY: 60,
    headStyles: {
      valign: "middle",
      halign: "center",
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    didDrawPage: function (data) {
      // Header
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.text(`Consumable`, data.settings.margin.right, 10);
      // doc.line(1, 12, 4, 4);

      // Footer
      var str = "Page " + doc.internal.getNumberOfPages();

      doc.setFontSize(10);

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      var pageSize = doc.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    },
  });

  doc1.autoTable({
    html: "#non_consumable_table",
    theme: "grid",
    bodyStyles: { lineColor: [255, 255, 255] },
    startY: 60,
    headStyles: {
      valign: "middle",
      halign: "center",
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    didDrawPage: function (data) {
      // Header
      doc1.setFontSize(10);
      doc1.setTextColor(40);
      doc1.text(`Non-Consumable`, data.settings.margin.right, 10);
      // doc.line(1, 12, 4, 4);

      // Footer
      var str = "Page " + doc1.internal.getNumberOfPages();

      doc1.setFontSize(10);

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      var pageSize = doc1.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc1.text(str, data.settings.margin.left, pageHeight - 10);
    },
  });

  doc.save("Consumable.pdf");
  doc1.save("Non-Consumable.pdf");
});
