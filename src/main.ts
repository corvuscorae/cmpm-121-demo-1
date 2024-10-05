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
