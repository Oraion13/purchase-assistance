//-------------------------------Estimation-------------------------
// IDs from above.html
const minutes_date = document.getElementById("minutes_date");
const minutes = document.getElementById("minutes");
const minutes_cell = document.getElementById("minutes_cell");

// setup note order dean
const setup_minutes = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open(
    "GET",
    `../../api/files/minutes_recommended.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        if (got.length != 0) {
          let attr = document.createAttribute("data-id");
          attr.value = got[0].minutes_recommended_id; //table id

          // change cell name
          minutes_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          minutes_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Minutes</p>
            </div>
            <div class="table-cell">
                ${got[0].minutes_recommended_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].minutes_recommended_type};base64,${got[0].minutes_recommended}"></iframe>
            <a href="data:${got[0].minutes_recommended_type};base64,${got[0].minutes_recommended}" download="file.pdf">
            Download
            </a>
            
        `;
        }
      }
    }
  };

  xhr.send();
};

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_minutes();
});

// don't forget to import this file
