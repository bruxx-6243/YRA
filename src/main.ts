import "./style/style.css";

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



// The main function
const fetchData = () => {
  const errorMsg = document.querySelector<HTMLParagraphElement>(".error");
  const nameInput = document.querySelector<HTMLInputElement>("input");
  const message = document.querySelector<HTMLDivElement>(".display__data");
  const SubmitBtn = document.querySelector<HTMLButtonElement>(".submit-btn");

  let name: string;
  let avatar: string;
  let year: number;

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

      if (target.value === "") {
        errorMsg.innerText = "*Please type something";
      } else if (target.value.length < 3) {
        errorMsg.innerText = "*Your name nust be at least 3 characters";
        nameInput.style.borderColor = "rgb(170, 10, 10)";
        nameInput.style.color = "rgb(170, 10, 10)";
        SubmitBtn.setAttribute("disabled", "true");
      } else {
        errorMsg.innerText = "";
        nameInput.style.borderColor = "rgb(105, 105, 196)";
        nameInput.style.color = "rgb(255, 255, 255)";
        SubmitBtn.removeAttribute("disabled");

        name = target.value;
      }
    });
  }

  document
    .querySelector<HTMLFormElement>("form")
    ?.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      (async () => {
        try {
          const response = await fetch(`https://api.agify.io/?name=${name}`);
          const { age } = await response.json();
          year = Math.floor(new Date().getFullYear() - age);

          switch (true) {
            case age <= 14:
              avatar = "👶🏼";
              break;
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
              avatar = "";
          }

          if (message) {
            if (age === null) {
              message.innerText = `Sorry I can't find your age ${name} 😢`;
              document.title = `Age not founded 😢`;
            } else {
              message.innerHTML = `Hey <span class="name"> ${name}</span> <br /> you're ${age} years old and you were born in ${year} <br /> <span class="year">${avatar}</span>`;
              document.title = ` ${name} | 🎉 ${age}`;
            }
          }
        } catch (err) {
          console.log(err);
        }
      })();
    });
};

fetchData();
