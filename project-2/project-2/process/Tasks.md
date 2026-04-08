# Project 2: Team Tasks

## Project 2 Deliverables

The team needs to prepare:

- the finished project link
- the GitHub repo link
- a video walkthrough
- a PDF about the project

Each team member needs to submit:

- the project link in their GitHub repo
- the PDF link in their GitHub repo
- the video link in their GitHub repo

## PDF Notes

The PDF should include:

- at least 5 screen grabs from the project
- a few paragraphs about the project intentions
- a few paragraphs about implementation and libraries or techniques used
- a description and summary of at least 2 references that inspired the project

Jason will handle the PDF.

## Video Notes

The video should include:

- a live walkthrough of the project
- each team member recording audio about the part they contributed
- Yann putting all team audio clips together into one final video
- Yann capturing the project walkthrough on video
- Yann syncing the audio recordings with the video capture and editing everything together
- a final video file small enough for GitHub

Yann will handle the video.

## Current Shared Data Setup

The project already has a shared app state in `js/core/RobotShopApp.js`.

This is the current handoff plan:

- Jason should save the consent checkbox result in `this.app.projectData.consentGiven`
- Jason should move the user into the questions section with `this.app.setScreen("questions")`
- Ray is saving the question answers, robot result, color choice, raw audio, and filtered audio
- Yann should read the final robot data from the shared app state instead of remaking the logic

Useful shared data for reveal:

- `this.app.projectData.selectedRobotType`
- `this.app.projectData.selectedColor`
- `this.app.projectData.filteredAudio`
- `this.app.projectData.audioStatus.isConfirmed`
- `this.app.getSelectedRobotImagePath()`

## Jason

### Main Task

Build the **menu** and handle the **PDF**.

### What Jason Needs To Do

- create the title
- create the play button
- create the instruction button
- write the instruction text
- add the required consent checkbox for voice recording and sampling
- save the consent result in `this.app.projectData.consentGiven`
- make the play button only continue when consent is checked
- move the user to the question section with `this.app.setScreen("questions")`
- make the menu feel welcoming, clear, and cartoonish
- do his menu coding in `js/screens/MenuScreen.js`
- organize the final PDF content
- record a short audio clip talking about his own contribution and share it with Yann
- share the final menu text and instruction text with Ray for consistency and PDF writing

### Deliverables

- finished menu code
- finished instruction text
- working consent checkbox in the menu
- working play button that enters the question screen
- finished PDF
- short recorded audio clip shared with Yann for the final video

### Step By Step

1. Make the menu layout.
2. Add the title, play button, and instruction button.
3. Add the consent checkbox and make it required.
4. Save the checkbox state in `this.app.projectData.consentGiven`.
5. Make the play button go to `this.app.setScreen("questions")` only after consent is checked.
6. Do the menu code in `js/screens/MenuScreen.js`.
7. Write short and friendly instruction text.
8. Test that the menu works properly.
9. Collect screen grabs and writing for the PDF.
10. Assemble the final PDF.
11. Record a short audio clip about your contribution and share it with Yann.
12. Share the final menu text, instruction text, and PDF with Ray.

## Yann

### Main Task

Handle the **robot reveal animation** in `Three.js` and the **video walkthrough**.

### What Yann Needs To Do

- set up `Three.js` for the reveal section before building it
- build the rotating package section
- make the package clickable
- make the package open
- reveal the final robot image
- play the modified voice audio during the reveal
- use `this.app.projectData.selectedRobotType` for the final robot type
- use `this.app.projectData.selectedColor` for the chosen robot color
- use `this.app.projectData.filteredAudio` for the final robot sound
- only play the reveal audio after `this.app.projectData.audioStatus.isConfirmed` is true
- use `this.app.getSelectedRobotImagePath()` to get the correct final robot image path
- help keep the reveal section visually consistent
- record and prepare the video walkthrough
- collect the team audio clips from Jason and Ray
- put all member audio clips together into one final video
- capture the project walkthrough on video
- edit the full video together
- sync the audio recordings with the video capture
- make sure the final video file is small enough for GitHub
- do his reveal coding in `js/screens/RevealScreen.js`

### Deliverables

- working reveal animation
- working package open interaction
- robot reveal working with audio
- finished video walkthrough
- final edited video file sized for GitHub

### Step By Step

1. Set up `Three.js` for the reveal section.
2. Do the reveal code in `js/screens/RevealScreen.js`.
3. Read the final robot type, color, and filtered audio from the shared app state.
4. Use `this.app.getSelectedRobotImagePath()` for the final robot image.
5. Build the rotating 3D package in `Three.js`.
6. Add the click interaction.
7. Make the package open.
8. Show the final robot image in the reveal.
9. Connect the modified voice audio to the reveal.
10. Test the reveal section for timing and polish.
11. Collect the recorded audio clips from Jason and Ray.
12. Capture the project walkthrough on video.
13. Sync the audio recordings with the video capture.
14. Edit the full video together.
15. Make sure the video file is small enough for GitHub.
16. Organize the final video and share it with Ray.

## Ray

### Main Task

Handle the **questions**, **color customization**, **AI robot images**, and **audio recording**.

### What Ray Needs To Do

- define the overall visual style
- generate or prepare the AI robot images for the project
- build the robot question flow
- include the color choice inside the question section
- map answers to the 5 robot types
- set up the local JSON data
- use `Fetch API` to load the local JSON data
- build the voice recording step
- apply a simple robotic filter to the recorded voice
- connect all parts into one consistent experience
- do the main coding in `js/screens/QuestionScreen.js`
- do the voice section coding in `js/screens/VoiceScreen.js`
- manage the data in `assets/data/questions-data.json` and `assets/data/robots-data.json`
- connect shared app flow in `js/app.js` and `js/core/RobotShopApp.js` when needed
- keep the shared reveal data ready for Yann in `js/core/RobotShopApp.js`
- record a short audio clip talking about her own contribution and share it with Yann

### Deliverables

- finished visual direction in the project
- finished AI robot images ready for the project
- working question flow
- working robot type mapping
- working local JSON setup
- working audio recording
- working simple robotic audio effect
- shared result data ready for reveal use
- short recorded audio clip shared with Yann for the final video

### Step By Step

1. Set the visual direction for the whole project.
2. Generate or prepare the AI robot images and keep them organized.
3. Build the question flow and answer logic.
4. Add the color choice into the question flow.
5. Map answers to the 5 robot types.
6. Set up the local JSON structure.
7. Use `Fetch API` to load the local JSON data.
8. Build the 5 second voice recording step.
9. Apply a simple robotic effect to the recorded voice.
10. Keep the final robot type, selected color, and filtered audio ready in shared app state for Yann.
11. Connect Jason's menu and Yann's reveal into the full experience.
12. Record a short audio clip about your contribution and share it with Yann.
13. Test the project for consistency and polish.

## Robot Types

The project will use:

- companion robot
- domestic robot
- security robot
- social robot
- utility robot

## Shared Reminder

- keep the project simple
- keep the design cartoonish
- keep the style consistent
- communicate finished work early
- make sure all assets are organized
- use local JSON instead of an outside API
- use the shared app state instead of duplicating saved data in different files
