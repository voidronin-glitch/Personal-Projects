class LightsOutGame {
   // Constructs a LightsOut instance for either a 5x5 or 3x3 game, depending 
   // on if the is5x5 argument is true or false, respectively
   constructor(is5x5) {
      if (is5x5) {
         this.rowCount = 5;
         this.columnCount = 5;
      }
      else {
         this.rowCount = 3;
         this.columnCount = 3;
      }
      
      // Allocate the light array, with all lights off
      const lightCount = this.rowCount * this.columnCount;
      this.lights = [];
      for (let i = 0; i < lightCount; i++) {
         // Each light is a frozen object with members "on" and 
         // "lastToggle"
         const light = Object.freeze({
            "on": false,
            "lastToggle": new Date()
         });
         this.lights.push(light);
      }
         
      // Perform a series of random toggles to generate a winnable game grid
      while (this.allLightsOut()) {
         // Generate random lights
         for (let i = 0; i < this.lights.length * 2; i++) {
            const randRow = Math.floor(Math.random() * this.rowCount);
            const randCol = Math.floor(Math.random() * this.columnCount);
            
            // Toggle at the location
            this.toggle(randRow, randCol);
         }
      }
      
      // Store the start time
      this.startTime = new Date();
   }
   
   // Returns true if all lights are out, false otherwise
   allLightsOut() {
      for (let i = 0; i < this.lights.length; i++) {
         // Even 1 light being on implies that not all are out/off
         if (this.lights[i].on)
            return false;
      }
      
      // All lights were checked and none are on, so lights are out!
      return true;
   }
   
   // Gets the light object at the specified location. The light object has 
   // members "on" and "lastToggle".
   // Returns null if either index is out of bounds.
   getLight(rowIndex, columnIndex) {
      if (rowIndex < 0 || rowIndex >= this.rowCount ||
         columnIndex < 0 || columnIndex >= this.columnCount) {
         return null;   
      }
      
      // Return the light
      return this.lights[rowIndex * this.columnCount + columnIndex];
   }
   
   // Toggles the light at (row, column) and each orthogonally
   // adjacent light
   toggle(row, column) {
      const now = new Date();
      const locations = [
         [row, column], [row - 1, column], [row + 1, column], 
         [row, column - 1], [row, column + 1]
      ];
      for (let location of locations) {
         row = location[0];
         column = location[1];
         if (row >= 0 && row < this.rowCount && 
            column >= 0 && column < this.columnCount) {
            // Compute array index
            const index = row * this.columnCount + column;
            
            // Toggle the light
            this.lights[index] = Object.freeze({
               "on": !this.lights[index].on,
               "lastToggle": now
            });
         }
      }
   }
   
   // Getter for the 'won' property, which is true if all lights are out, 
   // false otherwise
   get won() {
      return this.allLightsOut();
   }
}