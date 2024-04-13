const canvas = document.getElementById("canvas");
const screen = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Colour palette
const cBackground = "#FBF5F3"
const cNought = "#E28413"
const cDarkNought = "#a7610e"
const cCross = "#DE3C4B"
const cDarkCross = "#c22130"
const cGrid = "#000022"

function isArrayInArray(parent, searchItem) {
  for (var i = 0; i < parent.length; i++) {
    let checker = false
    for (var j = 0; j < parent[i].length; j++) {
      if (parent[i][j] === searchItem[j]) {
        checker = true
      } else {
        checker = false
        break;
      }
    }
    if (checker) {
      return true
    }
  }
  return false
}

function drawText(text, position, size, colour) {
  screen.font = size + "px Poppins"
  screen.fillStyle = colour;
  screen.fillText(text, position.x, position.y);
}

function drawRect(position, size, colour) {
  screen.fillStyle = colour;
  screen.fillRect(Math.round(position.x), Math.round(position.y), Math.round(size.x), Math.round(size.y));
}

function drawGrid(position, size, colour, thickness = 20) {
  screen.lineWidth = thickness;
  screen.strokeStyle = colour;

  screen.beginPath();
  screen.moveTo(position.x + size / 3, position.y); // First line down
  screen.lineTo(position.x + size / 3, position.y + size);
  screen.moveTo(position.x + size * 2 / 3, position.y); // Second line down
  screen.lineTo(position.x + size * 2 / 3, position.y + size);
  screen.moveTo(position.x, position.y + size / 3); // First line across
  screen.lineTo(position.x + size, position.y + size / 3);
  screen.moveTo(position.x, position.y + size * 2 / 3); // Second line across
  screen.lineTo(position.x + size, position.y + size * 2 / 3);
  screen.stroke();
  screen.closePath();

}

function drawNought(position, radius, colour, thickness = 20) {
  screen.lineWidth = thickness;
  screen.strokeStyle = colour;

  screen.beginPath()
  screen.arc(position.x + radius, position.y + radius, radius - (thickness / 2), 0, Math.PI + (Math.PI * 3) / 2, false);
  screen.stroke();
  screen.closePath();
}

function drawCross(position, size, colour, thickness = 20) {
  screen.lineWidth = thickness;
  screen.strokeStyle = colour;

  screen.beginPath();
  screen.moveTo(position.x, position.y)
  screen.lineTo(position.x + size, position.y + size)
  screen.moveTo(position.x + size, position.y)
  screen.lineTo(position.x, position.y + size)
  screen.stroke();
  screen.closePath();
}

class Game {
  constructor() {
    this.backgroundColour = "#555555";
    this.nextTurn = "cross";
    this.crossPositions = [];
    this.noughtPositions = [];
  }
  update(clickEvent = 0) {
    // Draw grid respective to canvas size
    let gridSize = 800 / 1080 * canvas.height;
    if (gridSize > canvas.width - 50) gridSize = canvas.width - 50;
    drawGrid({ x: canvas.width / 2 - gridSize / 2, y: canvas.height / 2 - gridSize / 2 }, gridSize, cGrid, 1 / 40 * gridSize)

    if (clickEvent != 0 && this.nextTurn != "") {
      // Convert click event to new cross/nought position
      let position = { x: clickEvent.clientX, y: clickEvent.clientY };
      if (canvas.width / 2 - gridSize / 2 < position.x && position.x < canvas.width / 2 - gridSize / 2 + gridSize &&
        canvas.height / 2 - gridSize / 2 < position.y && position.y < canvas.height / 2 - gridSize / 2 + gridSize) {
        let x = Math.floor((position.x - (canvas.width / 2 - gridSize / 2)) / (gridSize / 3))
        let y = Math.floor((position.y - (canvas.height / 2 - gridSize / 2)) / (gridSize / 3))
        if (this.nextTurn == "cross") {
          if (!(isArrayInArray(this.crossPositions, [x, y])) && !(isArrayInArray(this.noughtPositions, [x, y]))) {
            this.crossPositions.push([x, y]);
            if (this.crossPositions.length > 3) {
              this.crossPositions.splice(0, 1);
            }
            this.nextTurn = "nought"
          }

        } else {
          if (!(isArrayInArray(this.crossPositions, [x, y])) && !(isArrayInArray(this.noughtPositions, [x, y]))) {
            this.noughtPositions.push([x, y]);
            if (this.noughtPositions.length > 3) {
              this.noughtPositions.splice(0, 1);
            }
            this.nextTurn = "cross"
          }
        }
      }
    }
    if (this.nextTurn == "") {
      this.nextTurn = "cross"
    }
    // Draw noughts and crosses
    for (let i = 0; i < this.crossPositions.length; i++) {
      let colour = cCross;
      if (i == 0 && this.crossPositions.length == 3 && this.nextTurn == "cross") {
        colour = cDarkCross;
      }
      drawCross({
        x: (canvas.width / 2 - gridSize / 2) + this.crossPositions[i][0] * gridSize / 3 + 1 / 40 * gridSize,
        y: (canvas.height / 2 - gridSize / 2) + this.crossPositions[i][1] * gridSize / 3 + 1 / 40 * gridSize
      }, gridSize / 3.6, colour, 1 / 40 * gridSize)
    }
    for (let i = 0; i < this.noughtPositions.length; i++) {
      let colour = cNought;
      if (i == 0 && this.noughtPositions.length == 3 && this.nextTurn == "nought") {
        colour = cDarkNought;
      }
      drawNought({
        x: (canvas.width / 2 - gridSize / 2) + this.noughtPositions[i][0] * gridSize / 3 + 1 / 40 * gridSize,
        y: (canvas.height / 2 - gridSize / 2) + this.noughtPositions[i][1] * gridSize / 3 + 1 / 40 * gridSize
      }, gridSize / 7, colour, 1 / 40 * gridSize)
    }

    // Display whos turn it is 
    if (this.nextTurn == "cross") {
      drawText("Cross's turn", { x: canvas.width / 2 - 90, y: canvas.height / 2 - gridSize / 2 - 35 }, 30, cGrid);
    } else {
      drawText("Nought's turn", { x: canvas.width / 2 - 100, y: canvas.height / 2 - gridSize / 2 - 35 }, 30, cGrid);
    }

    // Check win
    let result = this.checkWin();
    if (result != 0) {
      this.showWinScreen(result)
    }

  }
  checkWin() {
    if (this.noughtPositions.length == 3) {
      if ((this.noughtPositions[0][0] == this.noughtPositions[1][0] && this.noughtPositions[1][0] == this.noughtPositions[2][0]) ||
        (this.noughtPositions[0][1] == this.noughtPositions[1][1] && this.noughtPositions[1][1] == this.noughtPositions[2][1])) {
        return "nought"
      }
      let assumption = true;
      for (let i = 0; i < this.noughtPositions.length; i++) {
        if (this.noughtPositions[i][0] != this.noughtPositions[i][1]) {
          assumption = false;
          i = 4;
        }
      }
      if (assumption) {
        return "noughts"
      }
      assumption = true;
      for (let i = 0; i < this.noughtPositions.length; i++) {
        if (this.noughtPositions[i][0] != 2 - this.noughtPositions[i][1]) {
          assumption = false;
          i = 4;
        }
      }
      if (assumption) {
        return "noughts"
      }
    }
    if (this.crossPositions.length == 3) {
      if ((this.crossPositions[0][0] == this.crossPositions[1][0] && this.crossPositions[1][0] == this.crossPositions[2][0]) ||
        (this.crossPositions[0][1] == this.crossPositions[1][1] && this.crossPositions[1][1] == this.crossPositions[2][1])) {
        return "cross"
      }
      let assumption = true;
      for (let i = 0; i < this.crossPositions.length; i++) {
        if (this.crossPositions[i][0] != this.crossPositions[i][1]) {
          assumption = false;
          i = 4;
        }
      }
      if (assumption) {
        return "cross"
      }
      assumption = true;
      for (let i = 0; i < this.crossPositions.length; i++) {
        if (this.crossPositions[i][0] != 2 - this.crossPositions[i][1]) {
          assumption = false;
          i = 4;
        }
      }
      if (assumption) {
        return "cross"
      }
    }
    return 0;
  }
  showWinScreen(result) {
    this.nextTurn = "";
    this.noughtPositions = [];
    this.crossPositions = [];
    let text = "";
    if (result == "cross") {
      text = "Crosses has won!";
    } else {
      text = "Noughts has won!";
    }
    let rectWidth = 400;
    let rectHeight = 100;
    let thickness = 5
    drawRect({ x: canvas.width / 2 - rectWidth / 2 - thickness, y: canvas.height / 2 - rectHeight / 2 - thickness }, { x: rectWidth + thickness * 2, y: rectHeight + thickness * 2 }, cGrid)
    drawRect({ x: canvas.width / 2 - rectWidth / 2, y: canvas.height / 2 - rectHeight / 2 }, { x: rectWidth, y: rectHeight }, cBackground)
    drawText(text, { x: canvas.width / 2 - rectWidth / 4 - 32, y: canvas.height / 2 - 10 }, 30, cGrid)
    drawText("Click anywhere to reset.", { x: canvas.width / 2 - rectWidth / 4 - 70, y: canvas.height / 2 + 23 }, 30, cGrid)
  }
}


function resizeListener() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  update();
}
window.addEventListener("resize", resizeListener, true);


function clickListener(event) {
  update(event);
}
window.addEventListener("click", clickListener, true);

game = new Game();

function update(event) {
  // Draw background
  drawRect({ x: 0, y: 0 }, { x: canvas.width, y: canvas.height }, cBackground);
  game.update(event);
}

function loop() {
  // window.requestAnimationFrame(loop);
  //update();
}

update();