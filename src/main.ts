import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "a tiny game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// make ant button
const buttonText = "🐜";
const button = document.createElement("button");
button.innerHTML = buttonText;
app.append(button);

// show count
let counter: number = 0;
const countDisplay = document.createElement("div");
countDisplay.innerHTML = `ants: ${counter}`;
app.append(countDisplay);

// count -- helper fcn
function editCount(amount: number) {
  counter += amount;
  countDisplay.innerHTML = `ants: ${Math.round(counter)}`;

  // handle upgrade button usability
  upgradeButton.disabled = counter < 10;
}

// increase count -- click button
button.addEventListener("click", () => {
  editCount(1);
});

// increase count -- automatic
let lastTime: number = 0;
let growthRate: number = 0;
function autoCounter(timestamp: number) {
  if (lastTime) {
    // Calculate time since last frame
    const deltaTime = timestamp - lastTime;
    // Increment counter based on time: 1 unit per 1000 ms (1 second)
    editCount((deltaTime / 1000) * growthRate);
  }

  // Update the last time
  lastTime = performance.now();

  // Continue the animation loop
  requestAnimationFrame(autoCounter);
}

// Start the animation loop
requestAnimationFrame(autoCounter);

// upgrade for automation -- increase growthRate
const upgradeText = "👑";
const upgradeButton = document.createElement("button");
upgradeButton.innerHTML = upgradeText;
app.append(upgradeButton);

// purchase upgrade
const upgradeCost: number = 10;
upgradeButton.addEventListener("click", () => {
  editCount(-upgradeCost);
  growthRate++;
});
