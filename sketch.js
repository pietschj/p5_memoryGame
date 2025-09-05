// Game state variables
let cards = [];
let flippedCards = [];
let pairsFound = 0;

// A flag to prevent clicking while a non-match is being shown
let isChecking = false;

// Grid and card layout settings
const numCols = 4;
const numRows = 4;
const cardSize = 80;
const padding = 12;
const totalCards = numCols * numRows;

/**
 * The Card class encapsulates all data and behavior for a single card.
 */
class Card {
  constructor(x, y, size, faceColor) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.faceColor = faceColor; // The color that is the "face" of the card
    this.isFlipped = false;
    this.isMatched = false;
  }

  /**
   * Draws the card on the canvas. It shows the back unless it's flipped or matched.
   */
  draw() {
    // Card back styling
    stroke(0);
    strokeWeight(2);
    fill(65, 105, 225); // Royal Blue
    rect(this.x, this.y, this.width, this.height, 10); // Rounded corners

    // If the card is flipped or already matched, draw its face
    if (this.isFlipped || this.isMatched) {
      // Card face background
      fill(255);
      rect(this.x, this.y, this.width, this.height, 10);

      // Draw the shape representing the card's face
      noStroke();
      fill(this.faceColor);
      ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width * 0.6);
    }
  }

  /**
   * Checks if a given point (px, py) is inside the card's bounds.
   * @param {number} px - The x-coordinate of the point to check.
   * @param {number} py - The y-coordinate of the point to check.
   * @returns {boolean} True if the point is inside the card.
   */
  contains(px, py) {
    return px > this.x && px < this.x + this.width &&
           py > this.y && py < this.y + this.height;
  }

  /**
   * Toggles the flipped state of the card.
   */
  flip() {
    this.isFlipped = !this.isFlipped;
  }
}

/**
 * The setup function is called once when the program starts.
 * It initializes the game, creates the cards, and shuffles them.
 */
function setup() {
  createCanvas(400, 400);

  // Define the 8 unique faces (using p5.js color objects)
  let colors = [
    color('red'), color('green'), color('cyan'), color('yellow'),
    color('orange'), color('purple'), color('lime'), color('magenta')
  ];
  // Duplicate the colors array to create pairs
  let cardFaces = colors.concat(colors);

  // Shuffle the faces randomly
  shuffle(cardFaces, true);

  // Calculate starting position to center the grid
  const startX = (width - (numCols * cardSize + (numCols - 1) * padding)) / 2;
  const startY = (height - (numRows * cardSize + (numRows - 1) * padding)) / 2;

  // Create the grid of Card objects
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      let x = startX + i * (cardSize + padding);
      let y = startY + j * (cardSize + padding);
      let face = cardFaces.pop();
      cards.push(new Card(x, y, cardSize, face));
    }
  }
}

/**
 * The draw function is called continuously and renders the game state.
 */
function draw() {
  background(34, 139, 34); // Forest Green background
  for (let card of cards) {
    card.draw();
  }

  // Display a "You Win!" message when all pairs are found
  if (pairsFound === totalCards / 2) {
    fill(255, 255, 0, 200); // Semi-transparent yellow
    noStroke();
    rect(0, 0, width, height);
    fill(0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
  }
}

/**
 * Called once after every time a mouse button is pressed.
 */
function mousePressed() {
  // Don't allow clicks if we are checking a pair or if the game is over
  if (isChecking || pairsFound === totalCards / 2) {
    return;
  }

  for (let card of cards) {
    // Check if the click was on a card that isn't already flipped or matched
    if (card.contains(mouseX, mouseY) && !card.isFlipped && !card.isMatched) {
      if (flippedCards.length < 2) {
        card.flip();
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          isChecking = true;
          checkForMatch();
        }
      }
    }
  }
}

/**
 * Checks if the two currently flipped cards are a match.
 */
function checkForMatch() {
  const [card1, card2] = flippedCards;

  // We use .toString() because p5.js color objects are complex
  if (card1.faceColor.toString() === card2.faceColor.toString()) {
    // It's a match!
    card1.isMatched = true;
    card2.isMatched = true;
    pairsFound++;
    flippedCards = [];
    isChecking = false;
  } else {
    // Not a match, flip them back after a 1-second delay
    setTimeout(() => {
      card1.flip();
      card2.flip();
      flippedCards = [];
      isChecking = false;
    }, 1000);
  }
}
