# Food Tracker

## Purpose

An application developed for learning React Native.

## Description

Track the food your have in your home with this mobile app. This application uses local storage on the phone to store your items.
 
### Features
* List View
   * Provides a list view of all the items available in your fridge, freezer, and pantry. Anything with a barcode can be added to the list for viewing.
* Delete Action
   * Delete from the list using a left swipe on the row.
* Barcode scanning
   * Allows you to quickly add food to a list by scanning the barcode on food packaging using your phones camera.

## How to Run

This app is not available on any app store, but you can run it using expo. 

### Prerequisites
* [Install Expo](https://docs.expo.io/versions/v36.0.0/get-started/installation)

### Run
1. Inside this projects root directory run: `npm start`. This will also open the Expo GUI in your browser, take note of the QR code in the bottom left corner.
1. On your mobile device, connect to the same wireless network as your computer.
1. Scan the QR code from the first step.
   * If using Android - use the Expo app to scan the QR code from your terminal to open your project. 
   * If using iOS - use the built-in QR code scanner from the Camera app.
1. The Food Tracker app will start in the Expo app on your mobile device.