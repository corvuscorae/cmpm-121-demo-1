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

// increase count -- helper fcn
function increaseCounter() {
  counter++;
  countDisplay.innerHTML = `ants: ${counter}`;
}

// increase count -- click button
button.addEventListener("click", () => {
  increaseCounter();
});
app.append(countDisplay);

// increase count -- automatic
let lastTime: number = 0;
function updateCounter(timestamp: number){
    if(lastTime){
        // Calculate time since last frame
        const deltaTime = timestamp - lastTime;
        // Increment counter based on time: 1 unit per 1000 ms (1 second)
        counter += deltaTime / 1000;
    }

    // Update the last time
    lastTime = timestamp;
    
    // Continue the animation loop
    requestAnimationFrame(updateCounter);
}


// Start the animation loop
requestAnimationFrame(updateCounter);