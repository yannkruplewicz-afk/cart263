# Project 2: Robot Shop

## Project Overview

**Robot Shop** is an interactive web project where the user answers questions to find their ideal robot, records a short voice sample, and reveals their final robot from a package.

The experience should feel:

- playful
- friendly
- colorful
- cartoonish
- simple to use
- polished

The project should feel like a fun robot store experience, not a formal survey.

## Main Goal

The goal is to build a short interactive experience that is clear, visually consistent, and satisfying from start to finish.

The project is about:

- collecting user choices through a quiz
- matching those choices to a robot type
- customizing the robot through the question flow
- recording the user's voice and changing it with a simple robotic filter
- ending with a reveal animation and robot sound

## Project Link

- GitHub Pages project link: [Robot Shop project page](https://sleepyrayray.github.io/cart263/projects/project-2/)

## Updated Project 2 Deliverables

Project 2 now needs:

- the finished project link
- the GitHub repo link
- a video walkthrough
- a PDF about the project

Each team member needs to submit:

- the project link in their GitHub repo
- the PDF link in their GitHub repo
- the video link in their GitHub repo

The video will be one final edited walkthrough of the project.

The PDF will document the project with screen grabs, short writing, and project references.

See `Tasks.md` for the detailed PDF and video requirements.

There is no artist statement for Project 2.

There is no class presentation for Project 2.

## User Flow

### 1. Menu

The first screen welcomes the user.

It should include:

- title
- play button
- instruction button
- short instruction text
- required consent checkbox for voice recording and voice sampling

The user should not continue until they agree to the consent checkbox.

### 2. Question Stage

The user answers a short set of multiple choice questions about their ideal robot.

This stage should:

- collect user preferences
- guide the user toward a robot type
- include simple customization choices inside the question flow

The questions can shape:

- robot appearance
- personality
- behavior
- role or function

### 3. Voice Recording Stage

The user records about 5 seconds of their voice.

This stage should:

- capture a short voice sample
- keep the process simple and clear
- apply a simple robotic audio effect

The modified voice will be used later when the robot is revealed.

### 4. Final Reveal

The project ends with a reward moment.

The plan is:

- show a rotating 3D package
- let the user click it
- open the package
- reveal the chosen robot
- play the modified voice audio

For now, the revealed robot will use a 2D AI generated image.

## Robot Types

The project will use these 5 robot types:

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

### Planned Use

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

Use a local JSON file for robot data instead of an outside API.

This still works well with `Fetch API` because the project can fetch the local JSON file.

The JSON can hold:

- robot types
- question data
- answer mapping
- robot descriptions

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

## Recommended Scope

To keep the project manageable, the first version should stay small and focused.

Recommended limits:

- 5 robot types
- 4 to 6 quiz questions
- 1 voice recording step
- 1 strong final reveal animation

## Core Themes

### Data Collection

The project collects user answers and voice input and turns them into a robot result.

### AI

The robot images are AI generated and help shape the visual identity of the project.

## Team Workflow

- keep file names organized
- share finished work with Ray
- avoid duplicate code or conflicting styles
- clearly label where assets are stored
- communicate changes early

## Important Decisions

The team should decide these early:

- final question list
- how answers map to the 5 robot types
- what appearance choices will be asked in the question flow
- how the simple robotic voice effect will work
- how the local JSON data should be organized
- which AI image workflow will be used

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
