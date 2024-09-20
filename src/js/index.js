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

const dateFormatter = (date) => {
  const formatter = new Intl.DateTimeFormat('fa-IR', {
    calender:'persian',
    year:'numeric',
    month:'numeric',
    day:'numeric'
  })

      
        const recivedDate = new Date(date);
        const hour = recivedDate.getHours();
        const minutes = recivedDate.getMinutes();
        const persianHour = new Intl.NumberFormat('fa-IR').format(hour);
        const persianMinute = new Intl.NumberFormat('fa-IR').format(minutes);
        const finalDate = formatter.format(recivedDate);
        return (`${finalDate} در ساعت ${persianHour}:${persianMinute}`)
}

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
        const date = dateFormatter(p.date);
        result += `
         <div class="table-item">
                <span>${p.id}</span>
                <span class="desc">${p.type}</span>
                <span class="desc">${p.price}</span>
                <span>${p.refId}</span>
                <span class="desc">${date}</span>
                <button class="mobile-mode-btn-open hidden" data-open-btn-id=${p.refId}>جذئیات بیشتر</button>
              </div>
               <div class="table-item-mobile hidden" data-modal-id=${p.refId}>
                 <span>${p.id}</span>
                 <span>${p.type}</span>
                 <span>${p.price}</span>
                 <span>${p.refId}</span>
                 <span>${date}</span>
                 <button class="mobile-mode-btn-close" id=${p.refId} data-close-btn-id=${p.refId}>بستن</button>
               </div>`;
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


