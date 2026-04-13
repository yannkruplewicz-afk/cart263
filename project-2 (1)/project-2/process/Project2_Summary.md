# Project 2: RoboShop

## Project Overview

**RoboShop** is an interactive web project where the user visits a futuristic robot shop, answers a short set of matching questions, records a short greeting, and reveals a robot that fits them best.

The experience is meant to feel:

- playful
- friendly
- colourful
- cartoonish
- simple to use
- polished

The project should feel like a fun robot store experience rather than a formal survey.

## Design Direction

The visual direction is **cute sci-fi showroom**.

The project should feel like a friendly future robot store:

- soft futuristic
- clean and welcoming
- cartoonish but not too kiddish
- polished and product-focused

The main visual language uses:

- rounded panels and buttons
- neat dark outlines
- soft showroom colors with a few brighter accents
- big friendly titles with simple readable body text
- smooth fades, slides, and floating motion

Each section should still feel like part of the same shop:

- the menu should feel like the front display
- the questions should feel like a guided product matching screen
- the voice section should feel like you are giving life to the robot
- the reveal should feel like the final featured product display

## Main Goal

The goal is to build a short interactive experience that feels clear, visually consistent, and satisfying from start to finish.

The project is about:

- collecting user choices through a quiz
- matching those choices to a robot type
- customising the robot through the question flow
- recording the user's voice and changing it with a simple robotic filter
- ending with a reveal animation and robot sound

## Project Link

- GitHub Pages project link: [RoboShop project page](https://sleepyrayray.github.io/cart263/projects/project-2/)

## Main Experience

### 1. Menu

The first screen welcomes the user with:

- title
- short subtitle
- guide button
- guide popup with short instructions
- required consent checkbox for voice recording and voice sampling
- start button inside the guide popup

The user only continues after agreeing to the consent checkbox.

### 2. Question Stage

The user answers a short set of multiple choice questions to match with one of five robot types.

This stage also includes the robot colour choice.

### 3. Voice Recording Stage

The user records a short greeting for the robot.

This stage includes:

- up to 5 seconds of recording
- previewing the recording
- rerecording if needed
- a simple robotic voice effect used later in the reveal

### 4. Final Reveal

The project ends with a reward moment:

- a rotating 3D package
- click to open
- the chosen robot image reveal
- the modified robot voice playback
- a short robot description
- purchase button
- thank you message
- back to menu reset

For now, the revealed robot will use a 2D AI generated image.

## Robot Types

The project uses these 5 robot types:

- companion robot
- domestic robot
- security robot
- social robot
- utility robot

Each type should have a distinct look:

- companion robot: humanoid, friendly, rounded
- domestic robot: home helper, clean, compact
- security robot: tougher, sensor-heavy, protective
- social robot: expressive, sleek, approachable
- utility robot: practical, mechanical, tool-based

## Technical Direction

### Main Libraries

- `p5.js`
- `Three.js`

### Current Use

Use `p5.js` for:

- interface screens
- question flow
- voice recording section
- simple transitions
- decorative 2D motion

Use `Three.js` for:

- 3D package
- rotation
- click interaction
- opening animation
- final reveal

### Data Setup

The project uses local JSON data instead of an outside API.

This works well with `Fetch API` because the project can fetch the local files directly.

The JSON files hold:

- robot types
- question data
- answer mapping
- robot descriptions
- image path data

### Core Features Needed

- clickable buttons
- screen changes
- saved user selections
- consent checkbox logic
- robot matching logic
- image swapping
- voice recording
- simple robotic audio effect
- final reveal logic

## Core Themes

### Data Collection

The project collects user answers and voice input and turns them into a robot result.

### AI

The robot images are AI generated and help shape the visual identity of the project.

## Deliverables

Project 2 needs:

- the finished project link
- the GitHub repo link
- a video walkthrough
- a PDF about the project

Each team member needs to submit:

- the project link in their GitHub repo
- the PDF link in their GitHub repo
- the video link in their GitHub repo

The video will be one final edited walkthrough of the project.

The PDF will document the project with screen grabs, short writing, and references.

See `Tasks.md` for the team responsibilities and deliverable notes.

## Team Workflow

- keep file names organised
- share finished work clearly
- avoid duplicate code or conflicting styles
- clearly label where assets are stored
- communicate changes early

## Deadline

- final submission: **April 14**

## Final Outcome

The finished project should feel like a small, polished interactive experience.

By the end, the user should:

- feel welcomed
- understand the consent step
- enjoy the robot questions
- hear their voice turned into part of the robot experience
- get a satisfying final reveal
