import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
const header = document.createElement("h1");

const BACKGROUND_COLOR = "255, 166, 0";

/* column organization and main button prominence inspired by:
 *  > https://github.com/NickCorfmat/cmpm-121-demo-1/blob/main/src/main.ts
 *  > https://github.com/egitelma/cmpm-121-demo-1/blob/main/src/main.ts
 */
interface Column {
  key: string;
  div: HTMLDivElement;
}

const container: Column[] = [];

container.push({ key: "main", div: document.createElement("div") });
container.push({ key: "upgrades", div: document.createElement("div") });
const _MAIN = 0;
const _UPGRADES = 1;

for (let i = 0; i < container.length; i++) {
  const columnDiv = container[i].div;
  console.log(columnDiv);
  app.appendChild(columnDiv);
  columnDiv.style.float = "left";
  columnDiv.style.padding = "50px";
  columnDiv.style.display = "flex";
  columnDiv.style.flexDirection = "column";
  columnDiv.style.alignItems = "center";
}
container[_MAIN].div.append(header);
container[_MAIN].div.style.background = `rgba(${BACKGROUND_COLOR}, 0.8)`;

// special (oprah gif)
const oprah = document.createElement("img");
oprah.src =
  "https://akns-images.eonline.com/eol_images/Entire_Site/2016027/rs_394x222-160127120033-bees.gif?fit=around%7C394:222&output-quality=90&crop=394:222;center,top";

//* constants *//
const COST_MULTIPLIER = 1.15;
const MANUAL: Item = {
  name: "🐝",
  cost: -1,
  rate: 0,
  description: "buzz buzz",
  isUpgrade: false,
};

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
  isUpgrade: boolean;
}

interface Button {
  button: HTMLButtonElement;
  item: Item;
  bought?: Counter; // will track how many of this item has been bought
}

//* helper fcns *//
// function to make upgrade buttons
function makeButton(i: Item) {
  const result: Button = {
    button: document.createElement("button"),
    item: i,
  };
  if (i.isUpgrade)
    result.bought = { value: 0, div: document.createElement("div") };

  result.button.innerHTML = result.item.name;
  result.button.title = result.item.description;

  if (i.name == "🐝") {
    result.button.classList.add("glow-on-hover");
    container[_MAIN].div.append(result.button);
  } else {
    container[_UPGRADES].div.append(result.button);
  }
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

// execute clicker behavior + update display
function clickerHandler(b: Button) {
  editCount(-b.item.cost);
  config.growthRate.value += b.item.rate;

  // update display
  if (b.bought)
    b.bought.div.innerHTML = `${b.item.name} supply: ${b.bought.value}`;
  config.growthRate.display.innerHTML = `growth rate: ${config.growthRate.value.toFixed(1)} bees per second`;
}

// button click listener for clicker
function clickerPressed(b: Button) {
  b.button.addEventListener("click", () => {
    if (b.bought) {
      b.bought.value++;
      container[_MAIN].div.append(b.bought.div);
    }

    clicker.execute(b);

    if (b.item.isUpgrade) {
      b.item.cost *= COST_MULTIPLIER;
      b.button.innerHTML = `-${b.item.cost.toFixed(1)}`;
    }

    // SPECIAL: show a gif when oprah is clicked
    /* gif as background image inspired by:
     * > https://github.com/Cheristic/cmpm-121-demo-1/blob/main/src/style.css
     */
    if (b.item.name === "oprah") {
      document.body.style.backgroundImage = `url(${oprah.src})`;
      document.body.style.backgroundSize = `${100 / b.bought!.value}% ${100 / b.bought!.value}%`;
      app.style.color = "white";
    }
  });
}

// mouse hover listener for clicker
function clickerHovered(b: Button) {
  b.button.addEventListener("mouseover", () => {
    b.button.innerHTML = `-${b.item.cost.toFixed(1)}`;
  });
  b.button.addEventListener("mouseout", () => {
    b.button.innerHTML = `${b.item.name}`;
  });
}

//* game objects *//
const config = {
  name: "save the bees",
  count: { value: 0, display: document.createElement("div") },
  growthRate: { value: 0, display: document.createElement("div") },
};

const buttonArray: Button[] = [];
const clicker = {
  buttons: buttonArray,
  execute: (b: Button) => clickerHandler(b),
  listener: (b: Button) => {
    clickerPressed(b);
    if (b.item.isUpgrade) {
      clickerHovered(b);
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
    isUpgrade: true,
  },
  {
    name: "drone",
    cost: 100,
    rate: 2,
    description:
      "drone bees are males who try to mate with the queen and then die",
    isUpgrade: true,
  },
  {
    name: "queen",
    cost: 1000,
    rate: 50,
    description:
      "queen bees lay eggs, fertilizing only some. the unfertilized become drones, and the fertilized become workers or queens",
    isUpgrade: true,
  },
  {
    name: "keeper",
    cost: 10000,
    rate: 300,
    description:
      "beekeepers raise and care for colonies, usually in artificial beehives",
    isUpgrade: true,
  },
  {
    name: "oprah",
    cost: 100000,
    rate: 1500,
    description:
      "Oprah Winfrey is a media mogul best known for her talk show, The Oprah Winfrey Show",
    isUpgrade: true,
  },
];

availableItems.forEach((i) => {
  clicker.buttons.push(makeButton(i));
});
clicker.buttons.forEach(clicker.listener);

document.title = config.name;
header.innerHTML = config.name;
container[_MAIN].div.append(config.count.display);
container[_MAIN].div.append(config.growthRate.display);
