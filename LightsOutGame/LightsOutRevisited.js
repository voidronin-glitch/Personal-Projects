// Add an event listener for the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", domLoaded);

// Instance of LightsOutGame that stores information about the current game.
let game = new LightsOutGame(false);

// Handles canvas click events
function canvasClicked(e) {
   // Get the canvas and bounding client rectangle
   const canvas = e.target;
   const rect = canvas.getBoundingClientRect();
   
   // Compute click coordinates, relative to the canvas
   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;
   
   // Convert from pixel coordinates to row, column
   const row = Math.floor(y * game.rowCount / canvas.height);
   const column = Math.floor(x * game.columnCount / canvas.width);
   
   // Call clickLight
   clickLight(row, column);
}

// Handles a click at the specified location. Toggles lights and checks to see 
// if the game is won.
function clickLight(row, column) {
   // Ignore if the game is already won
   if (game.won)
      return;
   
   // Toggle the appropriate lights
   game.toggle(row, column);
   
   // Check to see if the game is won
   if (game.won) {
      // Compute the time taken to solve the puzzle
      const timeTaken = Math.floor( ((new Date()) - game.startTime) / 1000 );
      
      // Display message
      const infoDIV = document.getElementById("information");
      infoDIV.textContent = "You win! Solved in " + timeTaken + " seconds";
   }
}

// Called when the page's DOM loads. Adds click event listeners, starts a new 
// 3x3 game, and begins rendering.
function domLoaded() {
   // Add click event listeners for the two new game buttons
   const btn3x3 = document.getElementById("newGame3x3Button");
   btn3x3.addEventListener("click", function() {
      newGame(false);
   });
   const btn5x5 = document.getElementById("newGame5x5Button");
   btn5x5.addEventListener("click", function() {
      newGame(true);
   });

   // Add a click event listener for the canvas
   const canvas = document.getElementById("gameCanvas");
   canvas.addEventListener("click", canvasClicked);
   
   // Start a new 3x3 game
   newGame(false);
   
   // Begin rendering
   window.requestAnimationFrame(render);
}

// Resets to a random, winnable game with at least 1 light on
function newGame(is5x5) {
   // Create a new game instance
   game = new LightsOutGame(is5x5);
   
   // Clear the information <div>
   const infoDIV = document.getElementById("information");
   infoDIV.textContent = "";
}

function render() {
   // Request the next animation frame in advance
   window.requestAnimationFrame(render);
   
   // Lights fade in/out when toggled. A hard-coded animation duration of 500 
   // milliseconds is used. In practice, animation durations are often shorter.
   const animationDuration = 500;
   
   let canvas = document.getElementById("gameCanvas");
   let ctx = canvas.getContext('2d');
   
   // Compute width and height of a light's rectangle on the canvas
   const lightWidth = canvas.width / game.columnCount;
   const lightHeight = canvas.height / game.rowCount;
   
   // Render each light
   for (let row = 0; row < game.rowCount; row++) {
      for (let column = 0; column < game.columnCount; column++) {
         // Get the light
         const light = game.getLight(row, column);
         
         // Compute the time, in milliseconds, since the light's most recent 
         // toggle
         const timeSinceToggle = (new Date()) - light.lastToggle;
         
         // Compute the light's intensity
         let intensity;
         if (timeSinceToggle >= animationDuration)
            intensity = light.on ? 255.0 : 0.0;
         else if (light.on)
            intensity = timeSinceToggle / animationDuration * 255;
         else
            intensity = (1.0 - (timeSinceToggle / animationDuration)) * 255;
         
         // Set the light's color
         ctx.fillStyle = `RGB(${intensity}, ${intensity}, 0)`;
         
         // Fill the light's rectangle
         ctx.fillRect(
            lightWidth * column, lightHeight * row,
            lightWidth, lightHeight);
            
         // Draw a thin white border, so the lights are visually distinct
         ctx.strokeStyle = "white";
         ctx.strokeRect(
            lightWidth * column, lightHeight * row,
            lightWidth, lightHeight);
      }
   }
}