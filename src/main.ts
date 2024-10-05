import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "a tiny game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const buttonText = "🐜";
const button = document.createElement("button");
button.innerHTML = buttonText;
app.append(button);

let counter: number = 0;
const countDisplay = document.createElement("div");
countDisplay.innerHTML = `ants: ${counter}`;
button.addEventListener("click", () => {
    increaseCounter();
});
app.append(countDisplay);

function increaseCounter(){
    counter++;
    countDisplay.innerHTML = `ants: ${counter}`;
}

const seconds = 1;
const interval: number = 1000 * seconds;
setInterval(increaseCounter, interval);