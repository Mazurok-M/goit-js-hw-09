const startButton = document.querySelector("button[data-start]");
const stopButton = document.querySelector("button[data-stop]");

startButton.addEventListener("click", onStartRandomColor);
stopButton.addEventListener("click", onStopRandomColor);

stopButton.setAttribute("disabled", true);

let timerId = null;

function onStartRandomColor() {
  startButton.setAttribute("disabled", true);
  stopButton.removeAttribute("disabled");
  timerId = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function onStopRandomColor() {
  stopButton.setAttribute("disabled", true);
  startButton.removeAttribute("disabled");
  clearInterval(timerId);
}
