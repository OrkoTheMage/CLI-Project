//**************************//
//  LISTNERS AND CLI HTML  //
//************************//

// Display CLI
document.addEventListener('DOMContentLoaded', function () {
    const cliContainer = document.getElementById('cli-container');
    const cliPrompt = document.getElementById('cli-prompt');
    const cliInput = document.getElementById('cli-input');
    const cliContent = document.getElementById('cli-content');

// Listener
cliInput.addEventListener('keydown', handleInput);


//**************************//
//      CLI FUNCTIONS      //
//************************//

// Function to handle Enter key press
function handleInput(event) {
    if (event.key === 'Enter') {
      processCommand(cliInput.value.trim());
      cliInput.value = '';
    }
  }

// Function to display new message
function printOutput(message) {
    const outputContainer = document.createElement('div');
    outputContainer.innerHTML = message;

    // Append the new message to the content div
    document.getElementById('cli-content').appendChild(outputContainer);

    autoClear(6); // Assuming you want to clear after a certain number of messages
}

// Function to manually clear the CLI
function clear() {
    const children = Array.from(cliContent.children);
    children.forEach((child) => {
        if (
            child !== cliPrompt &&
            child !== cliInput &&
            !child.classList.contains('output') &&
            !childrenToKeep.includes(child)
        ) {
            cliContent.removeChild(child);
        }
    });
  }

// Function to automatically clear the CLI
function autoClear(limit) {
    const children = Array.from(cliContent.children);

    if (children.length > limit) {
        // Keep the last 'limit' children
        const childrenToKeep = children.slice(-limit);

        // Remove all children except for the prompt and input
        children.forEach((child) => {
            if (
                child !== cliPrompt &&
                child !== cliInput &&
                !child.classList.contains('output') &&
                !childrenToKeep.includes(child)
            ) {
                cliContent.removeChild(child);
            }
        });
    }
}


//**************************//
//          ROOMS          //
//************************//

const rooms = {
    start: {
        description: () => {
            if (inventory.lantern) {
                return "Study: With your lantern illuminating the surroundings you can see this, once dark room, was working as someones study. Many books are strew about, in piles and scatter. There is a cellar hatch to the south.";
            } else {
                return "Dark Room: You are in a dark room, with a dilapidated desk. There is a weathered note on it. Light partially peaks in from a north hallway.";
            }
        },
        actions: {
            north: "hallway",
            south: "alleyway",
            take: "note",
            inspect: "desk",
            inspect: "books",
            inspect: "book",
            take: "sword",
        },
    },

    alleyway: {
        description: "Alleyway: You are in an alleyway, finally, sunlight! It appears you're in a large city, the alley stretches further ahead. South, you see a dark-iron clad figure, slouched and wailing maddeningly. Behind you, north, is the cellar. ",
        actions: {
            north: "study",
            south: "alleyend"
        },
    },
    alleyend: {
        description: () => {
            if (foodGiven) {
                return "Alley End: The half-orc, now satisfied with the food you gave him, watches you pass without hostility. To the south, you see a busy thoroughfare.";
            } else {
                return "Alley End: Now visible, the figure is a half-orc. He's either unaware or too deranged to notice your presence. Though charging past him might change that. To the south, you see a busy thoroughfare.";
            }
        },
        actions: {
            north: "alleyway",
            south: "marketplace",
            give: "giveFood",
            sneak: "sneak"
        },
        sneakAllowed: true,
        sneakAttempted: false  // Add a flag to track sneak attempts
    },
    marketplace: {
        description: "Marketplace: Out of the alley you arrive at the busy street. All manner of creatures walk about. You see countless blocks of foreign architecture.",
        actions: {
  
        },
    },
    hallway: {
      description: "Hallway: You are in a dimly lit hallway. There are doorways to the east and west and a dark room to the south.",
      actions: {
        east: "kitchen",
        west: "storeroom",
        south: "start"
      },
    },
    storeroom: {
        description: "Store Room: You are in a cellar store room. There are a number of run-down barrels within the room and a door leading east.",
        actions: {
          east: "hallway",
          inspect: "barrels",
          inspect: "barrel",
          take: "lantern",
        },
      },
    kitchen: {
      description: "Kitchen: You are in a dusty kitchen, full of rotting food. There is a key on the table and a door leading west.",
      actions: {
        west: "hallway",
        take: "key",
        take: "food",
      },
    },
  };


//**************************//
//      ROOM MODIFIERS      //
//************************//

// Start room locked door
rooms.start.actions.south = () => {
    if (inventory.key) {
        printOutput("The hatch door creaks open. You unlock it with the key and enter an alleyway.");
        return "alleyway";
    } else {
        printOutput("You find a hatch door, its locked.");
        return null;
    }
};

// Able to get passed the Alleyend (food)
rooms.alleyend.actions.south = () => {
    if (foodGiven) {
        return "marketplace";
    } 
    if (sneakSuccessful) {
        return "marketplace";
    }
    else {
        printOutput("You'll alert the half-orc. Find a way around or deal with him");
        return null;
    }
};


//**************************//
//         OBJECTS         //
//************************//


const objects = {
    note: {
        description: '<strong>"Welcome to Sigil!</strong> It seems you found a portal here, through the machinations of <strong>The Lady of Pain</strong>, don\'t panic. There\'s plenty of food and supplies available. Come find me when you can." The note is signed <strong>"Proctor Torkka"</strong>.',
        take: () => {
            takeItem('note');
        },
    },
    desk: {
        description: 'There is nothing useful in the desk.',
        take: () => {
        },
    },
    books: {
        description: 'You rummage through the books. Mostly garbage but your latern light catches a glint of something metallic, a sword. Take it?',
        take: () => {
            takeItem('sword');
        },
    },
    book: {
        description: 'You rummage through the books. Mostly garbage but your latern light catches a glint of something metallic, a sword. Take it?',
        take: () => {
            takeItem('sword');
        },
    },
    key: {
        description: "A small brass key.",
        take: () => {
            takeItem('key');
        },
    },
    food: {
        description: "Rotten food, who would eat this?",
        take: () => {
            takeItem('food');
        },
        give: () => {
            giveFood();
        },
    },
    barrels: {
        description: "You found an lantern, it's old but it might be useful. Take it?",
        take: () => {
        },
    
    },
    barrel: {
        description: "You found an lantern, it's old but it might be useful. Take it?",
        take: () => {
        },
    
    },
    lantern: {
        description: "An old lantern. Still has some fuel left in it.",
        take: () => { 
            takeItem('lantern');
        },
    },
    sword: {
        description: "a quality short sword",
        take: () => {
            takeItem('sword');
        }
    },
};


//**************************//
//     OBJECT FUNCTIONS    //
//************************//

// Function to add item to inventory
function takeItem(item) {
    const inventorySize = Object.keys(inventory).length;
    const maxInventorySize = 5;

    if (inventorySize < maxInventorySize) {
        printOutput(`You take the ${item}.`);
        inventory[item] = true;
    } else {
        printOutput(`Your inventory is full. You cannot take the ${item}.`);
    }
}

// Function to give food, removes from inventory
function giveFood() {
    if (inventory.food && !foodGiven) {
        printOutput("You give the rotten food to the half-orc. He takes it and nods, allowing you to pass peacefully.");

        delete inventory.food;
        foodGiven = true;

    } else if (foodGiven) {
        printOutput("You already gave the food. The half-orc seems content.");
    } else {
        printOutput("You don't have any food to give.");
    }
}
//**************************//
//      GAME LOGIC: 1      //
//       GAME STATE       //
//************************//

//Globals
let currentRoom = rooms.start;
let moves = 0;
let score = 0;
const inventory = {};
let sneakSuccessful = false;
let foodGiven = false;

// Function for the move and score counters
function updateCounters() {
    const movesInfoElement = document.getElementById('moves-info');
    movesInfoElement.innerHTML = `<p>Moves: ${moves}</p>`;
  
    const scoreInfoElement = document.getElementById('score-info');
    scoreInfoElement.innerHTML = `<p>Score: ${score}</p>`;
  }

// Function to display current room description
function displayRoom() {
    //checks to see if descript is a function or regular.
    const description = typeof currentRoom.description === 'function'
        ? currentRoom.description() 
        : currentRoom.description;

    const descriptionParts = description.split(':');
    const boldText = `<strong>${descriptionParts[0]}</strong>`;
    const unboldedText = descriptionParts.slice(1).join('.');

    // Update the room info element
    const roomInfoElement = document.getElementById('room-info');
    roomInfoElement.innerHTML = `<p>${boldText}</p>`;
    
// Check if the player has entered the marketplace
if (currentRoom === rooms.marketplace) {
    // Print an initial message with a delay
    setTimeout(() => {
        printOutput("<strong>...and you are totally lost</strong>");

        // Set another timeout for the second message
        setTimeout(() => {
            printOutput("<strong>Chapter 1: END</strong>");
        }, 2000); // 2000 milliseconds (2 seconds) delay for the second message, adjust as needed
    }, 2000); // 2000 milliseconds (2 seconds) delay for the first message, adjust as needed
}

    printOutput(`${boldText}`);
    printOutput(`${unboldedText}`);
}


// Function to keep track of inventory
function displayInventory() {
    const inventoryItems = Object.keys(inventory);
    if (inventoryItems.length > 0) {
        printOutput("<strong>Inventory:</strong>");
        inventoryItems.forEach(item => {
            printOutput(`- ${item}`);
        });
    } else {
        printOutput("Your inventory is empty.");
    }
}


//**************************//
//      GAME LOGIC: 2      //
//        HANDLERS         //
//************************//

 // Function to handle player move actions
 function handleMovement(action) {
    if (currentRoom.actions[action]) {
       
        moves++;
        updateCounters();

        if (action === 'south' && currentRoom.actions.south instanceof Function) {
            // If the action is 'south' and it's a function, call the function
            const nextRoom = currentRoom.actions.south();
            if (nextRoom) {
                currentRoom = rooms[nextRoom];
                displayRoom();
            }
        } 
        else if (action === 'north' && currentRoom.actions.north instanceof Function) {
            // If the action is 'north' and it's a function, call the function
            const nextRoom = currentRoom.actions.north();
            if (nextRoom) {
                currentRoom = rooms[nextRoom];
                displayRoom();
            }
        }
        else {
            // If it's a regular action, get the next room and update
            const nextRoom = rooms[currentRoom.actions[action]];
            currentRoom = nextRoom;
            displayRoom();
        }
    } else {
        printOutput(`There is nothing to your ${action}. Try again.`);
    }
}

// Function to handle player object interactions
function handleObjectInteraction(action, object) {
    if (objects[object]) {
        
        moves++;
        updateCounters();
    
        switch (action) {
            case 'take':
            case 'grab':
            case 'get':
            case 'pickup':
            case 'pick':
            case 'pick-up':
            case 'loot':
                if (objects[object].take) {
                    objects[object].take();
                } else {
                    printOutput("You can't take the " + object + ".");
                }
                break;
           
            case 'inspect':
            case 'read':
            case 'open':
            case 'examine':
            case 'check':
                printOutput(objects[object].description);
                break;

            default:
                printOutput("I don\'t know that command for " + object + ". Try again.");
        }
    } else if (action && !object) {
        printOutput(action + " what? There was no object in that command.");
    } else {
        printOutput("There is no " + object + " to " + action + ".");
    }
}

function handleSneak() {
    if (currentRoom.sneakAllowed && !currentRoom.sneakAttempted) {
        printOutput("You attempt to sneak quietly.");

        // Determine the outcome (50/50 chance)
        sneakSuccessful = Math.random() < 0.5;

        if (sneakSuccessful) {
            printOutput("Your sneaking is successful. You move quietly.");
            // Add any additional logic or effects for a successful sneak
        } else {
            printOutput("Oops! Your attempt to sneak fails. You make some noise.");
            // Add any additional logic or effects for a failed sneak
        }

        // Set the sneakAttempted flag to true
        currentRoom.sneakAttempted = true;

    } else if (!currentRoom.sneakAllowed) {
        printOutput("There is no need to sneak here");
    } else {
        printOutput("You already attempted to sneak in this room.");
    }
}


//**************************//
//       GAME LOGIC: 3      //
//          COMBAT         //
//************************//

// Globals for combat
let playerHealth = 40;
let foeHealth = 20;
let inCombat = false;

// Function to start combat
function startCombat() {
    printOutput("You are now in combat!");
    inCombat = true;
}

// Function to end combat
function endCombat() {
    printOutput("Combat is over.");
    inCombat = false;
    // Reset health after combat
    playerHealth = 40;
}

// Function to update health based on combat outcome
function updateHealth(outcome) {
    const playerDamage = outcome.result === 'lose' ? 5 : 0; // Adjust as needed
    const foeDamage = outcome.result === 'win' ? 5 : 0; // Adjust as needed

    playerHealth -= playerDamage;
    foeHealth -= foeDamage;

    // Ensure health doesn't go below 0
    playerHealth = Math.max(playerHealth, 0);
    foeHealth = Math.max(foeHealth, 0);
}

// Function to determine attack type
function getAttackType(action) {
    const attackTypes = {
        heavy: 'heavy',
        quick: 'quick',
        counter: 'counter',
        dodge: 'dodge',
    };
    return attackTypes[action] || 'unknown';
}

// Function to determine combat outcome
function determineCombatOutcome(playerAction, enemyAction) {
    const playerAttackType = getAttackType(playerAction);
    const enemyAttackType = getAttackType(enemyAction);

    if (playerAttackType === enemyAttackType) {
        return { result: 'draw', message: 'It\'s a draw!', endCombat: false };
    }

    if (
        (playerAttackType === 'quick' && enemyAttackType === 'heavy') ||
        (playerAttackType === 'heavy' && enemyAttackType === 'counter') ||
        (playerAttackType === 'counter' && enemyAttackType === 'quick')
    ) {
        return { result: 'win', message: `You defeated the enemy with ${playerAction}!`, endCombat: true };
    } else if (playerAttackType === 'dodge') {
        return { result: 'draw', message: 'You dodged the enemy\'s attack!', endCombat: false };
    } else {
        return { result: 'lose', message: `You were defeated by the enemy's ${enemyAction}.`, endCombat: true };
    }
}

// Function to handle combat actions
function handleCombatAction(action) {
    if (!inCombat && currentRoom === rooms.alleyend && action === 'attack') {
        startCombat();
        printOutput("The half-orc notices you, and the combat begins!");
    } else if (inCombat) {
        const enemyAction = getRandomEnemyAction();

        // Determine the outcome
        const outcome = determineCombatOutcome(action, enemyAction);

        // Update health based on the outcome
        updateHealth(outcome);

        // Display the outcome
        printOutput(`You ${outcome.result}! ${outcome.message}`);

        // Check if combat should end (e.g., player defeated the enemy)
        if (outcome.endCombat) {
            endCombat();
        }
    } else {
        printOutput("You are not in combat.");
    }
}

// Function to get a random enemy action
function getRandomEnemyAction() {
    const actions = ['quick', 'heavy', 'counter', 'dodge'];
    const randomIndex = Math.floor(Math.random() * actions.length);
    return actions[randomIndex];
}


//**************************//
//      GAME LOGIC: 4      //
//      CLI COMMANDS      //
//************************//


// Function to process user input
function processCommand(command) {
    printOutput(`>${command}`);
    const commandArgs = command.split(' ');
    const mainCommand = commandArgs[0].toLowerCase();
    
    switch (mainCommand) {
        case 'clear':
            clear();
            break;

        case 'go':
        case 'move':
            const direction = commandArgs[1] ? commandArgs[1].toLowerCase() : '';
            handleMovement(direction);
            break;

        case 'north':
        case 'n':
            handleMovement('north');
            break;

        case 'east':
        case 'e':
            handleMovement('east');
            break;  

        case 'west':
        case 'w':
            handleMovement('west');
            break;   
                  
        case 'south':
        case 's':
            handleMovement('south');
            break;

        case 'room':
        case 'where am i':
        case 'where':
        case 'look':
        case 'here':
            displayRoom();
            break;

        case 'inventory':
        case 'bag':
        case 'inv':
        case 'i':
            displayInventory();
            break;

        case 'take':
        case 'grab':
        case 'get':
        case 'pickup':
        case 'pick':
        case 'pick-up':
        case 'loot':
        case 'inspect':
        case 'open':
        case 'read':
        case 'check':
        case 'examine':
            handleObjectInteraction(mainCommand, commandArgs[1]);
            break;

        case 'pick up':
            handleObjectInteraction(mainCommand, commandArgs[2]);
            break;
            
        case 'give':
        case 'hand':
        case 'throw':
            const objectToGive = commandArgs[1];
            if (currentRoom.actions.give && objects[objectToGive] && objects[objectToGive].give) {
            objects[objectToGive].give();
            } else {
            printOutput("You have nothing to give/throw or can't give/throw this item");
                }
            break;
        
        case 'sneak':
            handleSneak();
            break;

        case 'wait':
        case 'sleep':
        case 'rest':
            printOutput("Time passes but you are no closer to getting home.")
            break;

        case 'think':
            printOutput("You need to find a way out of this cellar and figure out just where the hell you ended up at. What did that note say?")
            break;

        case 'equip':
            printOutput("No need to equip anything you can only hold 5 items in your bag.")
            break;
            
        case 'help':
            printOutput ('<strong>If you need to go somewhere try commands like: </strong> north, south, east and west');
            printOutput('<strong>If you\'re lost try commands like: look, read, inspect, take - followed by an object</strong');
            printOutput('verbs like give, sneak and attack can be useful');
            printOutput('<strong>You can look at your inventory with the "inventory", "bag", "inv" or simpily "i" commands</strong');
            printOutput('You may also want to see "help-combat"')
                break;
        
        case 'help-combat':
            printOutput('')

        default:
            printOutput("I don\'t know that command. Try again.");
    }
}


//**************************//
//     INITIALIZE GAME     //
//************************//
    document.getElementById('ascii-art').style.display= 'none'
    displayRoom();
    updateCounters();
});
