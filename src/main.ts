import "./style/style.scss";
import preloaderIcon from "./preloader.gif";

// The main app
((app) => {
  const container = document.createElement("div");
  container.classList.add("container");
  container.innerHTML = `
    <div class="header">
      <h1 class="title">
        <span>Y</span>
        <span>R</span>
        <span>A</span>
      </h1>
      <p class="desc">#YRA, web app based on agify API that gives back fake age, year of birth and avatar.</p>
    </div>
    <div class="main">
      <form>
        <input type="text"  placeholder="Your Name Goes Here ...!!!!" />
        <p class="error"></p>
        <button class="submit-btn">Submit</button>
      </form>
      <div class="display__data"></div>
    </div>
    `;
  app?.append(container);
})(document.getElementById("app") as HTMLDivElement);

// DOM Elements
const errorMsg = document.querySelector<HTMLParagraphElement>(".error"),
  nameInput = document.querySelector<HTMLInputElement>("input"),
  message = document.querySelector<HTMLDivElement>(".display__data"),
  SubmitBtn = document.querySelector<HTMLButtonElement>(".submit-btn");

let name: string, avatar: string, year: number;

const preloder = () => {
  if (message) {
    message.innerHTML = `
      <img src=${preloaderIcon} alt="preloader icon" width="120" height="120"/>
      <h2 class="preloader">Loading...</h2>
    `;
  }
};

const getAndDisplayData = async () => {
  try {
    const response = await fetch(`https://api.agify.io/?name=${name}`);
    const { age } = await response.json();
    year = Math.floor(new Date().getFullYear() - age);

    switch (true) {
      case age <= 14:
        avatar = "πΆπΌ";
        break;
      case age > 14 && age <= 24:
        avatar = "π§π½";
        break;
      case age > 24 && age <= 64:
        avatar = "π§π½";
        break;
      case age > 64:
        avatar = "π΄πΌ";
        break;
      default:
    }

    if (message) {
      if (age === null) {
        message.innerText = `Sorry I can't find your age ${name} π’`;
        document.title = `Age not founded π’`;
      } else {
        message.innerHTML = `Hey <span class="name"> ${name}</span> <br /> you're ${age} years old and you were born in ${year} <br /> <span class="year">${avatar}</span>`;
        document.title = ` ${name} | π ${age}`;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// The main function
const handlerData = () => {
  if (nameInput && errorMsg && SubmitBtn) {
    nameInput.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        errorMsg.innerText = "*Sorry you can't use space";
        return;
      }
    });

    nameInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const nameRegExp = /^[A-Za-z]+$/;

      if (target.value === "") {
        errorMsg.innerText = "*Please type something";
      } else if (target.value.length < 3) {
        errorMsg.innerText = "*Your name nust be at least 3 characters";
        nameInput.classList.add("is__notCorrect");
        SubmitBtn.setAttribute("disabled", "true");
      }else if(!target.value.match(nameRegExp)){
        errorMsg.innerText = "*You can use only latin characters";
      } else {
        errorMsg.innerText = "";
        nameInput.classList.remove("is__notCorrect");
        SubmitBtn.removeAttribute("disabled");

        name = target.value;
      }
    });
  }

  document
    .querySelector<HTMLFormElement>("form")
    ?.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      preloder();

      setTimeout(() => {
        getAndDisplayData();
      }, 2500);
    });
};

handlerData();
