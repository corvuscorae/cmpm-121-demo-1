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
let counter: number = 1000000;
const countDisplay = document.createElement("div");
countDisplay.innerHTML = `bees: ${counter}`;
app.append(countDisplay);

// count -- helper fcn
function editCount(amount: number) {
  counter += amount;
  countDisplay.innerHTML = `bees: ${Math.round(counter)}`; // rounding here so we dont get fractional bees

  // for each upgrade button, adjust usability (diable or enable) as needed
  upgradeButtons.forEach(function (b) {
    b.button.disabled = counter < b.item.cost;
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
interface Item {
  name: string,
  cost: number,
  rate: number
};

const availableItems : Item[] = [
  {name: "queen", cost: 10, rate: 0.1},
  {name: "nest", cost: 100, rate: 2},
  {name: "hive", cost: 1000, rate: 50},
];

interface upgradeButton {
  button: HTMLButtonElement;
  item: Item;
  bought: number; // will track how many of this item has been bought
}

// function to make upgrade buttons
function makeUpgradeButton(i: Item) {
  const result: upgradeButton = {
    button: document.createElement("button"),
    item: i,
    bought: 0,
  };
  result.button.innerHTML = result.item.name;
  app.append(result.button);

  return result;
}

// function to apply upgrades -- deduct cost and adjust growth rate
function upgradeHandler(thisButton: upgradeButton) {
  editCount(-thisButton.item.cost);
  growthRate += thisButton.item.rate;

  // update display
  growthRateDisplay.innerHTML = growthRateMessage(growthRate);
}

// array of upgrade buttons
const upgradeButtons: upgradeButton[] = [];

availableItems.forEach((i) => upgradeButtons.push(makeUpgradeButton(i)));

// listeners to purchase upgrades
upgradeButtons.forEach(function (b) {
  b.button.addEventListener("click", () => {
    b.bought++;
    upgradeHandler(b);
    upgradeDisplayHandler(b);
    b.item.cost *= 1.15;
    // console.log(b.cost);
  });
});

//* STATUS DISPLAYS *//
// growth rate status
function growthRateMessage(rate: number) {
  return `growth rate: ${rate.toFixed(1)} bees per second`;
}

const growthRateDisplay = document.createElement("div");
growthRateDisplay.innerHTML = growthRateMessage(growthRate);
app.append(growthRateDisplay);

// upgrades purchased status
function upgradesBoughtMessage(b: upgradeButton) {
  return `${b.item.name} supply: ${b.bought}`;
}

// upgrades purchased status -- create an array of div elements
const upgradesBoughtDisplay: HTMLDivElement[] = [];

// upgrades purchased status -- add a new div element for every upgrade button
upgradeButtons.forEach(function (b) {
  const newDisplay = document.createElement("div");
  upgradesBoughtDisplay.push(newDisplay);
  newDisplay.innerHTML = upgradesBoughtMessage(b);
  app.append(newDisplay);
});

// upgrades purchased status -- helper fcn to update message with amount bought
function upgradeDisplayHandler(b: upgradeButton) {
  const i = upgradeButtons.findIndex((e) => e === b);
  upgradesBoughtDisplay[i].innerHTML = upgradesBoughtMessage(b);
}
