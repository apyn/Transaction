const Toggler = document.querySelector(".toggler");
const sidebar = document.querySelector(".sidbar");
const main = document.querySelector(".main-section");
const hideDataBtn = document.querySelector("#dashboard-btn");
const searchInput = document.querySelector("#search-payment");
const getDataBtn = document.querySelector("#get-data-btn");
const filterSelect = document.querySelector("#filter");
const typeSelect = document.querySelector("#type");

const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");

let allPaymentData = [];

let originalDatas = [];

const root = document.documentElement;
Toggler.addEventListener("click", () => {
  sidebar.classList.toggle("sidbar-hide");
  // backdrop.classList.remove("hiddenModal");
});

main.addEventListener("click", () => {
  sidebar.classList.remove("sidbar-hide");
});

document.addEventListener("DOMContentLoaded", () => {
  getDataBtn.addEventListener("click", (e) => getData(e));
  hideDataBtn.addEventListener("click", (e) => hideData(e));
  backdrop.classList.add("hiddenModal");
  modal.addEventListener("click", (e) => e.stopPropagation());

  backdrop.addEventListener("click", closeModal);
});

const fetchData = () => {
  axios.get("http://localhost:3000/transactions").then((res) => {
    res.data.forEach((item) => originalDatas.push(item));
  });
};

fetchData();

const filterHandler = (event) => {
  const filter = event.value;

  switch (filter) {
    case "low-to-high":
      axios
        .get("http://localhost:3000/transactions?_sort=price&_order=asc")
        .then((res) => searchItemShower(res.data));
      break;

    case "high-to-low":
      axios
        .get("http://localhost:3000/transactions?_sort=price&_order=desc")
        .then((res) => searchItemShower(res.data));
      break;

    case "new":
      const sortedData = originalDatas.sort(
        (first, second) => second.date - first.date
      );
      searchItemShower(sortedData);
      break;

    case "old":
      const sortedDataOlder = originalDatas.sort(
        (first, second) => first.date - second.date
      );
      searchItemShower(sortedDataOlder);
      break;

    case "all":
      searchItemShower(originalDatas);
      break;
  }
};

const typeHandler = (event) => {
  const type = event.value;
  let filteredByTypeItems = [];

  switch (type) {
    case "deposite":
      originalDatas.forEach((item) => {
        if (item.type.includes("افزایش")) filteredByTypeItems.push(item);
      });
      break;

    case "withdrawal":
      originalDatas.forEach((item) => {
        if (item.type.includes("برداشت")) filteredByTypeItems.push(item);
      });
      break;

    case "all":
      const sortedDataOlder = originalDatas.sort(
        (first, second) => first.date - second.date
      );
      searchItemShower(sortedDataOlder);
      break;
  }

  searchItemShower(filteredByTypeItems);
};

const searchHandler = () => {
  axios
    .get(`http://localhost:3000/transactions?refId_like=${searchInput.value}`)
    .then((res) => {
      searchItemShower(res.data);
    })
    .catch((err) => console.log(err));
};

const numberFormatterToPersian = (number) => {
  const persianNumber = new Intl.NumberFormat("fa-IR").format(number);
  return persianNumber.toString();
};

const searchItemShower = (data) => {
  const DOMData = document.querySelector(".payment-details");
  const searchInputValue = searchInput.value;
  let result = "";
  // let openModalBtn = [];
  data.forEach((element) => {
    const elementRefId = element.refId.toString();
    const existedPayment = elementRefId.includes(searchInputValue);

    if (existedPayment) {
      const date = dateFormatter(element.date);

      result += `
       <ol class="table-item">
              <li>${numberFormatterToPersian(data.indexOf(element) + 1)}</li>
              <li class="desc">${element.type}</li>
              <li class="desc">${numberFormatterToPersian(element.price)}</li>
              <li>${element.refId}</li>
              <li class="desc">${date}</li>
              <button id=${
                element.refId
              } class="mobile-mode-btn-open hidden" data-open-btn-id=${
        element.refId
      }>جذئیات بیشتر</button>
            </ol>
             <ol class="backdrop table-item-mobile hidden" data-modal-id=${
               element.id
             }>
              
               <li>${element.type}</li>
               <li>${numberFormatterToPersian(element.price)}</li>
               <li>${element.refId}</li>
               <li>${date}</li>
               <button class="mobile-mode-btn-close" id=${
                 element.id
               } data-close-btn-id=${element.id}>بستن</button>
             </ol>`;
      DOMData.innerHTML = result;
    } else if (!existedPayment) {
      result += "";
      DOMData.innerHTML = result;
    }
  });
};

const dateFormatter = (date) => {
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    calender: "persian",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const recivedDate = new Date(date);
  const hour = recivedDate.getHours();
  const minutes = recivedDate.getMinutes();
  const persianHour = new Intl.NumberFormat("fa-IR").format(hour);
  const persianMinute = new Intl.NumberFormat("fa-IR").format(minutes);
  const finalDate = formatter.format(recivedDate);
  return `${finalDate} در ساعت ${persianHour}:${persianMinute}`;
};

function getData(e) {
  e.preventDefault();
  const table = document.querySelector(".main");
  table.classList.remove("hidden");
  axios
    .get("http://localhost:3000/transactions")
    .then((res) => {
      const DOMDataTable = document.querySelector(".payment-details");
      const DOMDataModal = document.querySelector(".modal__header");
      let resultTable = ``;
      let resultModal = ``;
      allPaymentData = res.data.forEach((p) => {
        const date = dateFormatter(p.date);

        resultTable += `
                <ol                   
                 class="table-item">
                  <li>${numberFormatterToPersian(p.id)}</li>
                  <li class="desc">${p.type}</li>
                  <li class="desc">${numberFormatterToPersian(p.price)}</li>
                  <li>${p.refId}</li>
                  <li class="desc">${date}</li>
                  <button
                  id=${p.refId}
                   class="mobile-mode-btn-open hidden"
                   type="button"
                    > جذئیات بیشتر </button>
                </ol>
                `;
        resultModal += `
                <ol
                class="modal-open table-item-mobile hiddenModal"
                data-modal-id="${p.refId}"
              >
                <li class="mobile__items">
                  <span class="item__title">نوع تراکنش</span><span>${
                    p.type
                  }</span>
                </li>
                <li class="mobile__items">
                  <span class="item__title">مبلغ</span
                  ><span>${numberFormatterToPersian(p.price)}</span>
                </li>
                <li class="mobile__items">
                  <span class="item__title">شماره پیگیری</span><span>${
                    p.refId
                  }</span>
                </li>
                <li class="mobile__items">
                  <span class="item__title">تاریخ تراکنش</span><span>${date}</span>
                </li>
                <button
                  class="mobile-mode-btn-close"
                  id="${p.refId}"
                  data-close-btn-id="${p.refId}"
                >
                  بستن
                </button>
              </ol>
                
                `;
        DOMDataTable.innerHTML = resultTable;
        DOMDataModal.innerHTML = resultModal;

        const allModals = [...document.querySelectorAll(".modal-open")];
        const allOpenModalBtns = [
          ...document.querySelectorAll(".mobile-mode-btn-open"),
        ];

        openModalBtn(allOpenModalBtns);

        function openModalBtn(allOpenModalBtns) {
          const openModalByBtn = allOpenModalBtns.forEach((b) =>
            b.addEventListener("click", (e) => {
              e.preventDefault();
              const selectedBtn = e.target.getAttribute("id");

              const filterModals = allModals.forEach((m) => {
                const allModalIds = m.dataset.modalId;

                const selectedResult = allModalIds === selectedBtn;
                if (selectedResult) {
                  m.classList.remove("hiddenModal");
                  openModal();
                  return;
                } else if (!selectedResult) {
                  return;
                }
              });
            })
          );
          return openModalBtn;
        }

        const allCloseModalBtns = [
          ...document.querySelectorAll(".mobile-mode-btn-close"),
        ];
        closeModalBtn(allCloseModalBtns);

        function closeModalBtn(allCloseModalBtns) {
          const closeModalByBtn = allCloseModalBtns.forEach((b) =>
            b.addEventListener("click", (e) => {
              e.preventDefault();
              const selectedBtn = e.target.getAttribute("id");

              const filterModals = allModals.forEach((m) => {
                const allModalIds = m.dataset.modalId;

                const selectedResult = allModalIds === selectedBtn;
                if (selectedResult) {
                  m.classList.add("hiddenModal");
                  closeModal();
                  return;
                } else if (!selectedResult) {
                  return;
                }
              });
            })
          );
          return closeModalBtn;
        }
      });
    })
    .catch((err) => console.log(err));
}
function hideData(e) {
  const table = document.querySelector(".main");
  table.classList.add("hidden");
}

searchInput.addEventListener("input", searchHandler);
filterSelect.addEventListener("change", (e) => filterHandler(e.target));
typeSelect.addEventListener("change", (e) => typeHandler(e.target));

function openModal(e) {
  backdrop.classList.remove("hiddenModal");
}

function closeModal(e) {
  backdrop.classList.add("hiddenModal");
}
