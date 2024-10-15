import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "save the bees";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// make bee button
const buttonText = "🐝";
const button = document.createElement("button");
button.innerHTML = buttonText;
button.title = "buzz buzz";
app.append(button);

//*** HANDLE COUNT ***//
// show count
let counter: number = 0;
const countDisplay = document.createElement("div");
app.append(countDisplay);

// count -- helper fcn
function editCount(amount: number) {
  counter += amount;
  countDisplay.innerHTML = `bees: ${Math.round(counter)}`; // rounding here so we dont get fractional bees

  // for each upgrade button, adjust usability (diable or enable) as needed
  upgradeButtons.forEach(function (b) { b.button.disabled = counter < b.item.cost; });
}

// increase count -- click button
button.addEventListener("click", () => { editCount(1); });

// increase count -- automatic
let lastTime: number = 0;
let growthRate: number = 0;
function autoCounter(timestamp: number) {
  if (lastTime) {
    const deltaTime = timestamp - lastTime;     // calculate time since last frame
    editCount((deltaTime / 1000) * growthRate); // increment counter based on time: 1 unit per 1000 ms (1 second)
  }

  lastTime = performance.now();  
  requestAnimationFrame(autoCounter);   // continue the animation loop
}
requestAnimationFrame(autoCounter);     // start the animation loop

//*** UPGRADE BUTTONS ***//
// upgrade button interface
interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
}

const availableItems: Item[] = [
  {
    name: "worker",
    cost: 10,
    rate: 0.1,
    description:
      "worker bees are females who collect honey from foraging bees and tend to the bee larvae",
  },
  {
    name: "drone",
    cost: 100,
    rate: 2,
    description:
      "drone bees are males who try to mate with the queen and then die",
  },
  {
    name: "queen",
    cost: 1000,
    rate: 50,
    description:
      "queen bees lay eggs, fertilizing only some. the unfertilized become drones, and the fertilized become workers or queens",
  },
  {
    name: "keeper",
    cost: 10000,
    rate: 300,
    description:
      "beekeepers raise and care for colonies, usually in artificial beehives",
  },
  {
    name: "oprah",
    cost: 100000,
    rate: 1500,
    description:
      "Oprah Winfrey is a media mogul best known for her talk show, The Oprah Winfrey Show",
  },
];

interface upgradeButton {
  button: HTMLButtonElement;
  item: Item;
  bought: number; // will track how many of this item has been bought
  display: HTMLDivElement; // will show bought count
}

// function to make upgrade buttons
function makeUpgradeButton(i: Item) {
  const result: upgradeButton = {
    button: document.createElement("button"),
    item: i,
    bought: 0,
    display: document.createElement("div"),
  };
  result.button.innerHTML = result.item.name;
  result.button.title = result.item.description;
  
  app.append(result.button);

  return result;
}

// array of upgrade buttons
const upgradeButtons: upgradeButton[] = [];

// make a button for every item
availableItems.forEach((i) => upgradeButtons.push(makeUpgradeButton(i)));

const growthRateDisplay = document.createElement("div");
app.append(growthRateDisplay);

// function to apply upgrades -- deduct cost and adjust growth rate
function upgradeHandler(thisButton: upgradeButton) {
  editCount(-thisButton.item.cost);
  growthRate += thisButton.item.rate;

  // update display
  thisButton.display.innerHTML = `${thisButton.item.name} supply: ${thisButton.bought}`;
  growthRateDisplay.innerHTML = `growth rate: ${growthRate.toFixed(1)} bees per second`;
}

upgradeButtons.forEach(function (b) {
  // listeners to purchase upgrades
  b.button.addEventListener("click", () => {
    b.bought++;
    upgradeHandler(b);
    b.item.cost *= 1.15;
    b.button.innerHTML = `-${b.item.cost.toFixed(1)}`;
    app.append(b.display);

    // SPECIAL: show a video when oprah is clicked
    if (b.item.name === "oprah") oprah.style.display = "block"; // show iFrame
  });

  b.button.addEventListener("mouseover", () => {
    b.button.innerHTML = `-${b.item.cost.toFixed(1)}`;
  });
  b.button.addEventListener("mouseout", () => {
    b.button.innerHTML = `${b.item.name}`;
  });
});

// show oprah video
const oprah = document.createElement("img");
oprah.src =
  "https://akns-images.eonline.com/eol_images/Entire_Site/2016027/rs_394x222-160127120033-bees.gif?fit=around%7C394:222&output-quality=90&crop=394:222;center,top";
app.append(oprah);
oprah.style.display = "none"; // hide oprah
