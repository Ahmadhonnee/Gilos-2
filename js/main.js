const cardTemplate = document.querySelector("#cardTemplate");

const elStudentForm = document.querySelector(".addForm");

const productsList = document.querySelector(".resultList");
const elDeleteBtn = document.querySelector(".deleteBtn");
const elAddModalBtn = document.querySelector("#modalAddBtn");
const elModalTitle = document.querySelector("#editStudentModalLabel");
const elModalBtn = document.querySelector(".modalBtn");

const elManufacturers = document.querySelector("#model");
const elPhoneBenefitsFilter = document.querySelector("#manufacturer");

const elFilter = document.querySelector("#filterForm");

const myModal = new bootstrap.Modal(document.getElementById("student-modal"));
const counter = document.querySelector(".counter");
renderPhones();
addManufacturerList();
counterOf();
productsList.addEventListener("click", (evt) => {
  const target = evt.target;
  if (target.matches(".deleteBtn")) {
    const deletingId = +target.dataset.id;
    const deletingIndex = products.findIndex(
      (phone) => phone.id === deletingId
    );
    products.splice(deletingIndex, 1);
    renderPhones();
    localStorage.setItem("products", JSON.stringify(products));
    counterOf();
  }

  if (target.matches(".editBtn")) {
    const editingId = +target.dataset.id;
    const editingObj = products.find((phone) => phone.id === editingId);
    setFormValues(editingObj, "Edit product");

    elStudentForm.dataset.editingId = editingId;
  }
});
elAddModalBtn.addEventListener("click", () => {
  setFormValues({}, "Add product");
  elStudentForm.dataset.editingId = "";
});

elStudentForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const { editingId } = elStudentForm.dataset;

  const {
    title: { value: title },
    price: { value: price },
    model: { value: model },
    benefits: { value: benefits },
  } = elStudentForm.elements;

  // if (
  //   title.trim().length > 1 &&
  //   price.trim() > 1000 &&
  //   model.trim().length > 1
  // ) {
  const newPhone = {
    id: Math.floor(Math.random() * 1000),
    title,
    img: "https://picsum.photos/id/124/300/200",
    price,
    model,
    addedDate: new Date("2021-11-12").toISOString(),
    benefits: benefits.split(" "),
  };

  if (title.length && +price > 100 && model && benefits.length) {
    if (!editingId) {
      products.push(newPhone);
      counterOf();
      localStorage.setItem("products", JSON.stringify(products));
    } else {
      const editID = +editingId;
      console.log(editID);
      newPhone.id = +editingId;
      const editIndex = products.findIndex((phone) => phone.id === editID);

      products.splice(editIndex, 1, newPhone);
      localStorage.setItem("products", JSON.stringify(products));
    }
  }
  // }
  renderPhones();
  myModal.hide();
});

elFilter.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const {
    search: { value: searchValue },
    sortby: { value: sortbyValue },
    from: { value: fromValue },
    to: { value: toValue },
    manufacturer: { value: manufacturerValue },
  } = evt.target.elements;

  const filteredProducts = products.filter((phone) => {
    return (
      `${phone.title}`.trim().toLowerCase().includes(searchValue) &&
      phone.price >= +fromValue &&
      (+toValue ? phone.price <= +toValue : true) &&
      (manufacturerValue == 0 ? true : phone.model.includes(manufacturerValue))
    );
  });

  filteredProducts.sort((a, b) => {
    switch (+sortbyValue) {
      case 1:
        if (a.title > b.title) {
          return 1;
        } else if (b.title > a.title) {
          return -1;
        }
        return 0;
      case 2:
        return b.price - a.price;
      case 3:
        return a.price - b.price;
      default:
        return 0;
    }
  });
  renderPhones(filteredProducts);
  counterOf(filteredProducts);
});

function counterOf(arr = products) {
  counter.textContent = `Count: ${arr.length}`;
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
function renderPhones(arr = products) {
  productsList.innerHTML = null;

  arr.forEach((phone) => {
    const { id, title, img, price, model, addedDate, benefits } = phone;

    const templateClone = cardTemplate.cloneNode(true).content;

    const elDeleteBtn = templateClone.querySelector(".deleteBtn");
    elDeleteBtn.dataset.id = id;

    const elEditBtn = templateClone.querySelector(".editBtn");
    elEditBtn.dataset.id = id;

    const elPhoneImg = templateClone.querySelector(".phoneImg");
    elPhoneImg.src = img;

    const elPhoneTitle = templateClone.querySelector(".phoneTitle");
    elPhoneTitle.textContent = title;

    const elPhonePrice = templateClone.querySelector(".phonePrice");
    elPhonePrice.textContent = price;

    const elPhonePrePrice = templateClone.querySelector(".phoneSale");
    elPhonePrePrice.textContent = Math.floor(price + price * 0.1);

    const elPhoneManufacturer = templateClone.querySelector(".phoneBrand");
    elPhoneManufacturer.textContent = model;

    const elPhoneRealiseDate = templateClone.querySelector(".phoneRealiseDate");
    elPhoneRealiseDate.textContent = addedDate;

    const elPhoneBenefits = templateClone.querySelector(".phoneBenefits");

    benefits.forEach((benefit) => {
      const optionTag = document.createElement("li");
      optionTag.className = "badge bg-primary me-1 mb-1";
      optionTag.textContent = benefit;

      elPhoneBenefits.append(optionTag);
    });
    productsList.append(templateClone);
  });
}

function setFormValues({ title, price, model, benefits }, formType) {
  const {
    title: elTitle,
    price: elPrice,
    model: elModel,
    benefits: elBenefits,
  } = elStudentForm.elements;
  // const benefitsStr = benefits.join(" ");

  elTitle.value = title || "";
  elPrice.value = price || "";
  elModel.value = model || 0;
  elBenefits.value = benefits || "";

  elModalTitle.textContent = formType;
  elModalBtn.textContent = formType;
}

function addManufacturerList() {
  manufacturers.forEach((manufacturer) => {
    const manufacturerEl = document.createElement("option");
    manufacturerEl.textContent = manufacturer.name;
    manufacturerEl.value = manufacturer.name;

    elManufacturers.append(manufacturerEl);

    const manufacturerEl2 = document.createElement("option");
    manufacturerEl2.textContent = manufacturer.name;
    manufacturerEl2.value = manufacturer.name;

    elPhoneBenefitsFilter.append(manufacturerEl2);
  });
}
