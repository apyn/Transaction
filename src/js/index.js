const Toggler = document.querySelector(".toggler");
const sidebar = document.querySelector(".sidbar");
const main = document.querySelector(".main-section");
const hideDataBtn = document.querySelector("#dashboard-btn");
const searchInput = document.querySelector("#search-payment");
const getDataBtn = document.querySelector("#get-data-btn");

let allPaymentData = [];

const root = document.documentElement;
Toggler.addEventListener("click", () => {
  sidebar.classList.toggle("sidbar-hide");
});

main.addEventListener("click", () => {
  sidebar.classList.remove("sidbar-hide");
});

document.addEventListener("DOMContentLoaded", () => {
  getDataBtn.addEventListener("click", (e) => getData(e));
  hideDataBtn.addEventListener("click", (e) => hideData(e));
});

function getData(e) {
  e.preventDefault();
  const table = document.querySelector(".main");
  table.classList.remove("hidden");
  axios
    .get("http://localhost:3000/transactions")
    .then((res) => {
      const DOMData = document.querySelector(".payment-details");
      let result = ``;
      allPaymentData = res.data.forEach((p) => {
        result += `
            <ol class="table-item">
                  <li>${p.id}</li>
                  <li class="desc">${p.type}</li>
                  <li class="desc">${p.price}</li>
                  <li>${p.refId}</li>
                  <li class="desc">${p.date}</li>
                  <button
                    class="mobile-mode-btn-open hidden"
                    data-open-btn-id="${p.refId}" > جذئیات بیشتر </button>
                </ol>
                <ol class="table-item-mobile hidden" data-modal-id="${p.refId}">
                  <li>${p.id}</li>
                  <li>${p.type}</li>
                  <li>${p.price}</li>
                  <li>${p.refId}</li>
                  <li>${p.date}</li>
                  <button
                    class="mobile-mode-btn-close"
                    id="${p.refId}"
                    data-close-btn-id="${p.refId}" > بستن</button>
                </ol>`;
        DOMData.innerHTML = result;
        searchInput.addEventListener("input", searchJSONData);
      });
    })
    .catch((err) => console.log(err));

  function searchJSONData(e) {
    const value = e.target.value.trim();
    console.log(value);

    axios
      .get(`http://localhost:3000/transactions؟refId_like=${value}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
}

function hideData(e) {
  const table = document.querySelector(".main");
  table.classList.add("hidden");
}
