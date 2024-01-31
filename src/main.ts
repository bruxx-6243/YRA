import "./style/style.scss";
import preloaderIcon from "./preloader.gif";

// Creation of the DOM
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

const waitFunc = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const loader = (element: HTMLDivElement) => {
  return (element.innerHTML = `
      <img src=${preloaderIcon} alt="preloader icon" width="120" height="120"/>
      <h2 class="preloader">Loading...</h2>
    `);
};

async function getUserData(name: string) {
  try {
    const response = await fetch(`https://api.agify.io/?name=${name}`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const { age: userAge } = await response.json();

    return userAge;

    // TODO: Remove the type any by specifying the correct type
  } catch (e: any) {
    console.error(`Soemthing went wrong: ${e.message}`);
  }
}

function createAvatar(age: number) {
  let avatar;

  switch (true) {
    case age > 14 && age <= 24:
      avatar = "🧒🏽";
      break;
    case age > 24 && age <= 64:
      avatar = "🧓🏽";
      break;
    case age > 64:
      avatar = "👴🏼";
      break;
    default:
      avatar = "👶🏼";
  }

  return avatar;
}

async function displayMessage(
  element: HTMLDivElement,
  userName: string,
  userAge: number
) {
  const age = await getUserData(userName);
  const avatar = createAvatar(userAge);

  const year = Math.floor(new Date().getFullYear() - age);

  if (age === null || year === undefined) {
    element.innerText = `Sorry I can't find your age ${userName} 😢`;
    document.title = `Age not founded 😢`;
  } else {
    element.innerHTML = `Hey <span class="name"> ${userName}</span> <br /> you're ${age} years old and you were born in ${year} <br /> <span class="year">${avatar}</span>`;
    document.title = ` ${userName} | 🎉 ${age}`;
  }
}

const form = document.querySelector<HTMLFormElement>("form")!;

async function handleSubmit(event: any) {
  event.preventDefault();

  const element = document.querySelector<HTMLDivElement>(".display__data")!;
  let userName = event.target[0]?.value;

  if (!userName) {
    return;
  }

  const userAge = await getUserData(userName.toLowerCase());

  loader(element);
  await waitFunc(2500);
  displayMessage(element, userName, userAge);
  form.reset();
}

form.addEventListener("submit", (event) => handleSubmit(event));
