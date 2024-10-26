import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
const header = document.createElement("h1");
app.append(header);

// special (oprah gif)
const oprah = document.createElement("img");
oprah.src =
  "https://akns-images.eonline.com/eol_images/Entire_Site/2016027/rs_394x222-160127120033-bees.gif?fit=around%7C394:222&output-quality=90&crop=394:222;center,top";
app.append(oprah);
oprah.style.display = "none"; // hide oprah

//* constants *//
const COST_MULTIPLIER = 1.15;
const MANUAL: Item = {
  name: "🐝",
  cost: -1,
  rate: 0,
  description: "buzz buzz"
}

//* interfaces *//
interface Counter {
  value: number;
  div: HTMLDivElement;
}

interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
}

interface UpgradeButton {
  button: HTMLButtonElement;
  item: Item;
  bought?: Counter; // will track how many of this item has been bought
}

//* helper fcns *//
// function to make upgrade buttons
function makeUpgradeButton(i: Item) {
  const result: UpgradeButton = {
    button: document.createElement("button"),
    item: i,
  };
  if(i.cost > 0) result.bought = {value: 0, div: document.createElement("div")}

  result.button.innerHTML = result.item.name;
  result.button.title = result.item.description;

  app.append(result.button);

  return result;
}

// fuction to edit count and count display
function editCount(amount: number) {
  config.count.value += amount;
  config.count.display.innerHTML = `bees: ${Math.round(config.count.value)}`; // rounding here so we dont get fractional bees

  // for each upgrade button, adjust usability (diable or enable) as needed
  clicker.buttons.forEach(function (b) {
    b.button.disabled = config.count.value < b.item.cost;
  });
}

// time keeper to auto-increase count
let lastTime: number = 0;
function timekeeping(timestamp: number) {
  if (lastTime) {
    const deltaTime = timestamp - lastTime; // calculate time since last frame
    editCount((deltaTime / 1000) * config.growthRate.value); // increment counter based on time: 1 unit per 1000 ms (1 second)
  }

  lastTime = performance.now();
  requestAnimationFrame(timekeeping); // continue the animation loop
}
timekeeping(lastTime);
requestAnimationFrame(timekeeping); // start the animation loop

//* game objects *//
const config = {
  name: "save the bees",
  count: { value: 0, display: document.createElement("div") },
  growthRate: { value: 0, display: document.createElement("div") },
};

const buttonArray: UpgradeButton[] = [];
const clicker = {
  buttons: buttonArray,
  apply: (b: UpgradeButton) => {
    editCount(-b.item.cost);
    config.growthRate.value += b.item.rate;

    // update display
    if(b.bought) b.bought.div.innerHTML = `${b.item.name} supply: ${b.bought.value}`;
    config.growthRate.display.innerHTML = `growth rate: ${config.growthRate.value.toFixed(1)} bees per second`;
  },
  listen: (b: UpgradeButton) => {
    b.button.addEventListener("click", () => {
      if(b.bought){
        b.bought.value++;
        app.append(b.bought.div);
      }
      
      clicker.apply(b);

      if(b.item.cost > 0){
        b.item.cost *= COST_MULTIPLIER;
        b.button.innerHTML = `-${b.item.cost.toFixed(1)}`;
      }

      // SPECIAL: show a video when oprah is clicked
      if (b.item.name === "oprah") oprah.style.display = "block"; // show iFrame
    });
  
    if(b.item.cost > 0){
      b.button.addEventListener("mouseover", () => {
        b.button.innerHTML = `-${b.item.cost.toFixed(1)}`;
      });
      b.button.addEventListener("mouseout", () => {
        b.button.innerHTML = `${b.item.name}`;
      });
    }
  },
};

//* game items (data) *//
const availableItems: Item[] = [
  MANUAL,
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

availableItems.forEach((i) => {clicker.buttons.push(makeUpgradeButton(i))});
clicker.buttons.forEach(clicker.listen);

document.title = config.name;
header.innerHTML = config.name;
app.append(config.count.display);
app.append(config.growthRate.display);