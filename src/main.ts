import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "a tiny game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// make a button
const buttonText = "🐜";
const button = document.createElement("button");
button.innerHTML = buttonText;
app.append(button);

// show count
let counter: number = 0;
const countDisplay = document.createElement("div");
countDisplay.innerHTML = `ants: ${counter}`;
app.append(countDisplay);

// increase count -- helper fcn
function increaseCounter(amount: number) {
  counter += amount;
  countDisplay.innerHTML = `ants: ${Math.round(counter)}`;
}

// increase count -- click button
button.addEventListener("click", () => {
  increaseCounter(1);
});

// increase count -- automatic
let lastTime: number = 0;
function autoCounter(timestamp: number) {
  if (lastTime) {
    // Calculate time since last frame
    const deltaTime = timestamp - lastTime;
    // Increment counter based on time: 1 unit per 1000 ms (1 second)
    increaseCounter(deltaTime / 1000);
  }

  // Update the last time
  lastTime = performance.now();

  // Continue the animation loop
  requestAnimationFrame(autoCounter);
}

// Start the animation loop
requestAnimationFrame(autoCounter);
