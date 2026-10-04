# Enchanted Grove Description

## Inspiration

We found inspiration from the "Enchanted" aspect of the theme Enchanted Grove, and what OUR individual idea of what "Enchanted" looked like. We envisioned “enchanted” to include animals like butterflies, deer, and wolves along with plants like flowers, and cherry trees. We wanted to focus on an audience that enjoys cute and short games that focus on aesthetics. 

## What it does

We decided to build an interactive game that would allow the user to choose their own "Enchanted Grove". It begins by having the user choose between what aesthetic this grove will have: Mythical Garden, Moonlit Marsh, or Ancient Woods. Then there will be 4 rounds of minigames in order to implement what objects will be in this magical place. In the final screen, an image will display all the objects earned plus some statistics of the user’s journey.

## How we built it

For this project we decided to have AI as a partner and to focus on 3 main things: Design, Functionality, and User Experience. For each section of our game development we wrote down, and sketched the general idea of how the project should run. We also took the time to figure out what vibe we wanted our project to radiate by looking into different pinterest options and google doc fonts for the title and general text.

## Challenges we ran into
We had 3 drafts for this project.

**First draft:**
- Not pleasing visuals
- Very quiz like questions
- Mechanics didn't make sense
- Game objective wasn't clear

**Second Draft:**
- Game was over fast
- Game objective still wasn't clear
- Spent time looking for design inspiration

**Third Draft:**
- After implementing minigames, the game layout became distorted
- It was lacking sound design; it felt like sound could enhance the user experience
- It was missing a reward system; gameplay loop
	- do something wrong, something is taken away
	- do something right, you gain something

## Accomplishments that we're proud of

We are very proud of our game's evolution, from the first draft to the last. We all agreed on the vision for this project and we managed to bring it forward with our inputs. 

## What we learned

This project taught us how to effectively use AI as a tool to create something meaningful and how to work collaboratively with other people in the context of designing and programming, especially in Github. As it becomes company standard, knowing how to use AI without compromising our creativity will help us in our careers. Ultimately, this project gave us a glimpse into the working environment. 

## What's next for Magic Waits 
In the future, we want to add and modify a couple features. We will focus the game’s improvement on the finer details. More specifically, adding a butterfly cursor could enhance the feeling of “magic and whimsy” and will focus on our target audience, who will likely enjoy the cursor’s beauty. Next, we would like to manually fix some issues that the AI couldn’t catch. These issues include spacing out the footprints in the deer minigame to prevent overlaps and centering the emojis on some minigames. Lastly, adding human-made artwork and music will make our game feel more “human” and intentional. For example, creating our own assets can allow us to focus the color schemes depending on the location.

## Structure

- `index.html` - page markup and external file references
- `css/style.css` - all CSS that was previously inside `<style>`
- `js/core.js` - seeded randomness, palettes, SVG scene rendering, visual effects, and scene helpers
- `js/data.js` - grove/environment content and choice definitions
- `js/game.js` - game state, screen transitions, rounds, final screen, and save logic
- `js/minigames.js` - minigame engine and all minigame definitions
- `js/main.js` - startup wiring, button handlers, and initial scene setup
- `js/audio.js` - bgm, clicking, failure, and success sound effects

Open `index.html` from this folder to run the game. Keep the `css` and `js` folders beside it.
