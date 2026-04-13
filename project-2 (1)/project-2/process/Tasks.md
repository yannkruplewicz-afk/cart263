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
- `this.app.projectData.selectedColour`
- `this.app.projectData.filteredAudio`
- `this.app.projectData.audioStatus.isConfirmed`
- `this.app.getSelectedRobotImagePath()`

## Jason

### Main Task

Build the **menu** and handle the **PDF**.

### What Jason Needs To Do

- create the title and subtitle
- create the guide button
- write the guide popup text
- add the required consent checkbox for voice recording and sampling inside the guide popup
- add the start button inside the guide popup
- save the consent result in `this.app.projectData.consentGiven`
- make the start button only continue when consent is checked
- move the user to the question section with `this.app.setScreen("questions")`
- make the menu feel welcoming, clear, and cartoonish
- do his menu coding in `js/screens/MenuScreen.js`
- organize the final PDF content
- record a short audio clip talking about his own contribution and share it with Yann
- share the final menu text and instruction text with Ray for consistency and PDF writing

### Deliverables

- finished menu code
- finished guide popup text
- working consent checkbox in the menu
- working start button that enters the question screen
- finished PDF
- short recorded audio clip shared with Yann for the final video

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
- show a short robot description after the reveal audio
- add the purchase button and thank you flow
- reset the experience back to the menu after the final interaction
- use `this.app.projectData.selectedRobotType` for the final robot type
- use `this.app.projectData.selectedColour` for the chosen robot colour
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
- robot description and purchase flow working
- finished video walkthrough
- final edited video file sized for GitHub

## Ray

### Main Task

Handle the **questions**, **color customization**, **AI robot images**, and **audio recording**.

### What Ray Needs To Do

- define the overall visual style
- keep the visual style in the cute sci-fi showroom direction
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
- keep the design in the cute sci-fi showroom direction
- keep the style consistent
- communicate finished work early
- make sure all assets are organized
- use local JSON instead of an outside API
- use the shared app state instead of duplicating saved data in different files
