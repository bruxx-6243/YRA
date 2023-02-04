import "./style/style.css";
const app = document.getElementById("app") as HTMLDivElement;

(() => {
  const header = document.createElement("div") as HTMLDivElement;
  header.classList.add("header");

  header.innerHTML = `
    <h1 class="title">#YRA</h1>
    <p class="desc">Tell me your name and I'll reveal your real age.</p>
    `;
  app.append(header);
})();

const fetchData = (app: HTMLDivElement) => {
  const main = document.createElement("div") as HTMLDivElement;
  let name: string;

  main.innerHTML = `
  <form>
    <input type="text"  placeholder="Your Name Goes Here ...!!!!" />
    <p class="error"></p>
    <button class="submit-btn">Submit</button>
  </form>
  <div class="display__data"></div>
  `;
  app.append(main);

  const p = document.querySelector(".error") as HTMLParagraphElement;
  const inputEl = document.querySelector("input") as HTMLInputElement;
  const message = document.querySelector(".display__data") as HTMLDivElement;

  inputEl.addEventListener("keypress", (e: KeyboardEvent) => {
    console.log();
    if (e.code === "Space") {
      e.preventDefault();
      p.innerText = "*Sorry you can't use space";
    }
  });

  inputEl.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.value.length < 4) {
      p.innerText = "*Your name nust be at least 4 characters";
      inputEl.style.borderColor = "rgb(170, 10, 10)";
    } else {
      p.innerText = "";
      inputEl.style.borderColor = "rgb(105, 105, 196)";

      name = target.value;
    }
  });

  document
    .querySelector<HTMLFormElement>("form")
    ?.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      (async () => {
        try {
          const response = await fetch(`https://api.agify.io/?name=${name}`);
          const { age } = await response.json();
          const year = Math.floor(new Date().getFullYear() - age);

          const avatar = () => {
            if (age <= 12) {
              return "👶🏽";
            } else if (age > 12 && age <= 18) {
              return "🧒🏾";
            } else if (age > 25 && age <= 45) {
              return "🧑🏽";
            } else {
              return "🧓🏾";
            }
          };

          if (age === null) {
            message.innerText = `Sorry I can't find your age 😢`;
          } else {
            message.innerHTML = `Hey <span class="name">${name}</span> <br /> you're ${age} years old and you were born is ${year} <br /> <span class="year">${avatar()}</span>`;
          }
        } catch (err) {
          console.log(err);
        }
      })();
    });
};

fetchData(app);
