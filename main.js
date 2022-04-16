async function getResponse() {
  let response = await fetch(
    "https://randomuser.me/api/?results=20&inc=gender,name,nat,email,phone,location",
    {
      method: "GET",
    }
  );
  let content = await response.json();
  let list = document.querySelector(".user-list");
  let select = document.querySelector(".form-select");

  let listOptions = [];

  for (let key in content["results"]) {
    list.innerHTML += `
        <li class="user mt-3 pt-3 pb-3">
                    <div class="avatar d-flex"><img src="/imgs/user.svg" width="70%" alt=""></div>
                    <div class="user-content ms-3 d-flex">
                        <div class="user-name d-flex">
                            <div class="title me-2"><span>${content.results[key].name.title}</span></div>
                            <div class="first-name me-2"> <h5>${content.results[key].name.first}</h5></div>
                            <div class="last-name me-2"><h5>${content.results[key].name.last}</h5></div>
                        </div>
                        <div class="user-about d-flex">
                            <div class="first-row">
                                <div class="gender me-2"><span>gender:</span> ${content.results[key].gender}</div>
                                <div class="location me-2"><span>city: </span>  <div class="city ms-1">${content.results[key].location.city}</div></div>
                            </div>
                            <div class="second-row">
                                <div class="country me-2"><span>country: </span>${content.results[key].location.country}</div>
                                <div class="phone me-2"><span>phone:</span> ${content.results[key].phone}</div>
                            </div>
                        </div>
                    </div>
                   
                </li>
        `;
    listOptions.push(content.results[key].location.city);
  }

  let array = [...new Set(listOptions)];
  for (let i = 0; i < array.length; i++) {
    select.innerHTML += `
        <option value="${array[i]}">${array[i]}</option>
        `;
  }
}

async function onLoad() {
  await getResponse();
  const listItems = document.querySelectorAll(".user");
  const input = document.querySelector(".searchInput");
  const checkbox = document.querySelectorAll(".checkbox");
  const select = document.querySelector(".form-select");
  const send = document.querySelector(".send-button");
  const reviewInput = document.querySelector(".reviewInput");
  const modalbody = document.querySelector(".modal-body");

  checkbox.forEach(function (el) {
    el.addEventListener("click", (elem) => {
      if (elem.target.parentNode.innerText == "male") {
        listItems.forEach(function (element) {
          element.classList.remove("male", "female");
          if (element.querySelector(".gender").innerText !== "gender: male") {
            element.classList.add("female");
            male = true;
            female = false;
            all = false;
          }
        });
      } else if (elem.target.parentNode.innerText == "female") {
        listItems.forEach(function (el) {
          el.classList.remove("male", "female");
          if (el.querySelector(".gender").innerText !== "gender: female") {
            el.classList.add("male");
            male = false;
            female = true;
            all = false;
          }
        });
      } else {
        listItems.forEach(function (el) {
          el.classList.remove("male", "female");
          all = true;
          male = false;
          female = false;
        });
      }
    });
  });

  input.addEventListener("input", () => {
    if (input.value != "") {
      listItems.forEach(function (el) {
        if (
          el
            .querySelector(".user-name")
            .innerText.toUpperCase()
            .search(input.value.toUpperCase()) == -1
        ) {
          el.classList.add("hide");
        } else {
          el.classList.remove("hide");
        }
      });
    } else {
      listItems.forEach(function (el) {
        el.classList.remove("hide");
      });
    }
  });

  select.addEventListener("change", () => {
    if (select.value == 0) {
      listItems.forEach(function (el) {
        el.classList.remove("cityFilter");
      });
    } else {
      listItems.forEach(function (el) {
        console.log(`'${el.querySelector(".city").innerText}'`);
        if (el.querySelector(".city").innerText !== select.value) {
          el.classList.add("cityFilter");
        } else {
          el.classList.remove("cityFilter");
        }
      });
    }
  });
  const state = {
    posts: [],
    reviews: [],
    newReview: {
      body: "",
    },
  };

  async function PostRequest() {
    return fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(state.newReview),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

 async function sendReview(){
    modalbody.innerHTML += `
    <div class="review-content d-flex"><div class="avatar d-flex me-2"><img width="30px" height="30px" src="/imgs/user.svg"></div> ${reviewInput.value}</div>`;
    state.newReview.body = reviewInput.value;
    reviewInput.value = "";
    await PostRequest();
    setTimeout(() => {
    modalbody.innerHTML += `
        <div class="answer" style="text-align: end;">спасибо за отзыв!</div>
        `;
    }, 1000);
  }


  send.addEventListener("click", async () => {
        await sendReview()
  });
  reviewInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        await sendReview()
    }
  });
}

onLoad();
