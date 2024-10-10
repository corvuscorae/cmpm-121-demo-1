import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "a tiny game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// make bee button
const buttonText = "🐝";
const button = document.createElement("button");
button.innerHTML = buttonText;
app.append(button);

//*** HANDLE COUNT ***//
// show count
let counter: number = 0;
const countDisplay = document.createElement("div");
countDisplay.innerHTML = `bees: ${counter}`;
app.append(countDisplay);

// count -- helper fcn
function editCount(amount: number) {
  counter += amount;
  countDisplay.innerHTML = `bees: ${Math.round(counter)}`; // rounding here so we dont get fractional bees

  // for each upgrade button, adjust usability (diable or enable) as needed
  upgradeButtons.forEach(function (b) {
    b.button.disabled = counter < b.cost;
  });
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

//*** UPGRADE BUTTONS ***//
// upgrade button interface
interface upgradeButton {
  button: HTMLButtonElement;
  text: string;
  cost: number;
  rate: number;
}

// function to make upgrade buttons
function makeUpgrade(t: string, c: number, r: number) {
  const result: upgradeButton = {
    button: document.createElement("button"),
    text: t,
    cost: c,
    rate: r,
  };
  result.button.innerHTML = result.text;
  app.append(result.button);

  return result;
}

// function to apply upgrades -- deduct cost and adjust growth rate
function upgradeHandler(thisButton: upgradeButton) {
  editCount(-thisButton.cost);
  growthRate += thisButton.rate;
}

// array of upgrade buttons
const upgradeButtons: upgradeButton[] = [];

upgradeButtons.push(makeUpgrade("👑", 10, 0.1));
upgradeButtons.push(makeUpgrade("B", 100, 2));
upgradeButtons.push(makeUpgrade("C", 1000, 50));

// listeners to purchase upgrades
upgradeButtons.forEach(function (b) {
  b.button.addEventListener("click", () => {
    upgradeHandler(b);
  });
});
