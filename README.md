# mto-firefox-extension

## Description

Exhausted to manually copy/paste line by line tracklist from a comment in a youtube video (thx TracklistGuy <3) or from a soundcloud mix which the author generously answers this eternal question : ID ????

## Install

```
git clone https://github.com/Pieradtch/mto-firefox-extension.git
npm install
npm start
```

## Usage

Seriously ?

## TO-DO

1. Automatically paste the clipboard when action button is clicked.
2. Keyboard shortcut
3. Detect URL

Popup is used to configure preferenced search engine with local storage and propose an input text box and preview url. (button send message to background.js)
A context menu item is create with cursor selection and propose to open in multiple new tab.(Send message to background.js)
background.js listen for message, when triggered, get the local variable for prefered search engine and launch all the tabs.

