// IDs from above.html
const core_committee_date = document.getElementById("core_committee_date");
const core_committee = document.getElementById("core_committee");
const core_committee_cell = document.getElementById("core_committee_cell");

// setup note order dean
const setup_core_committee = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open(
    "GET",
    `../../api/files/putup_core_committee.php?ID=${purchase.purchase_id}`,
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
          attr.value = got[0].putup_core_committee_id; //table id

          // change cell name
          core_committee_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          core_committee_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Core Committee</p>
            </div>
            <div class="table-cell">
                ${got[0].putup_core_committee_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].putup_core_committee_type};base64,${got[0].putup_core_committee}"></iframe>
            <a href="data:${got[0].putup_core_committee_type};base64,${got[0].putup_core_committee}" download="file.pdf">
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
  setup_core_committee();
});

// don't forget to import this file
