#include "memory_fun.h"
#include <BLEDevice.h>
#include <BLE2902.h>
#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#include "atawi8c.h"
#include <vector>
#include <regex>
#ifndef PSTR
 #define PSTR // Make Arduino Due happy
#endif

////////////////////////////// LED Matrix defines //////////////////////////////

#define MATRIX_HEIGHT 8
#define MATRIX_WIDTH 32
#define NUM_LEDS MATRIX_HEIGHT*MATRIX_WIDTH
#define CHAR_WIDTH 6
#define DESIGN_LENGTH 6
#define MATRIX_PIN 14
#define RGB_PIN 38
#define MAX_BRIGHTNESS 30 // 50 is maximum for a 3A power supply for 256 LEDs
#define BRIGHTNESS MAX_BRIGHTNESS/2
#define MAX_FRAMES 100

////////////////////////////// BLE defines //////////////////////////////

#define SERVICE_UUID "1848"   // Media Control Service
#define SETUP_CHARACTERISTIC_UUID "6cf32036-9765-4a72-9bb7-74555500b000"  // Used for brightness, speed and state of LED matrix
#define TEXT_CHARACTERISTIC_UUID "6cf32036-9765-4a72-9bb7-74555500b001" // Used to upload text
#define DESIGN_CHARACTERISTIC_UUID "6cf32036-9765-4a72-9bb7-74555500b002" // Used to upload bitmaps and animations

////////////////////////////// Classes and their functions //////////////////////////////

/* Class to encapsulate BLE server (ESP32) callback functions */ 
class MyServerCallbacks : public BLEServerCallbacks {
  /* Sets connected device to true */
  void onConnect(BLEServer* pServer);

  /* Sets connected device to valse */
  void onDisconnect(BLEServer* pServer);
};

/* Class that encapsulates design characteristic callbacks */
class MyDesignCallbacks : public BLECharacteristicCallbacks {
  /* Calls setMatrixDesign if the receivedValue is valid and matrix is on */
  void onWrite(BLECharacteristic *pDesignCharacteristic);
};

/* Class that encapsulates text characteristic callbacks */
class MyTextCallbacks : public BLECharacteristicCallbacks {
  /* Calls setMatrixText if receivedValue is valid and matrix is on */
  void onWrite(BLECharacteristic *pTextCharacteristic);
};

/* Class that encapsulates setup characteristic callbacks */
class MySetupCallbacks : public BLECharacteristicCallbacks {
  /* Calls different functions based on the value received (setBrightness, turnMatrixOn, turnMatrixOff etc.) */
  void onWrite(BLECharacteristic *pSetupCharacteristic);
};

/* Class that contains animation specific functions */
class MyAnimations {
  
};

////////////////////////////// Function prototypes //////////////////////////////

/* Initializes the onboard RGB led*/
void initOnboardLed();

/* Initializes the LED matrix */
void initMatrix();

/* Initializes the BLE server */
void initBle();

/* Switches between RED and BLUE color to create a police effect */
  void policeCon();

/* Parses RGB short hex format color to RGB565 color value */
uint16_t parseShortHexColor(String colorStr);

/* Parses RRGGBB hex format color to RGB565 color value */
uint16_t parseHexColor(String colorStr);

/* Converts received string value to a bitmap and displays it */
void stringToBitmap(String receivedData);

/* Checks the value and sets brightness of the matrix if value is suitable */
void setMatrixBrightness(String value);

/* Extracts a bitmap image from receivedData string and displays it on the matrix */
void setMatrixDesign(String receivedData);

/* Displays the provided message on the matrix */
void setMatrixText(String message);

/* Sets all the pixels on the matrix to black/off if the matrix is not already off */
void turnMatrixOff();

/* Displays the previous design or text that was visible on the matrix before turned off */
void turnMatrixOn();

/* Calls stringToBitmap for as many frames as needed to play animation on matrix */
void playAnimation();

/* Prints info about items in ESP32 preferences storage */
void printInfo();

