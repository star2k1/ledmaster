#include <Arduino.h>
#include "ble_matrix.h"

////////////////////////////// Matrix and system globals //////////////////////////////
Preferences preferences;
int matrixHeight = 0;
int matrixWidth = 0;
int pixelPerChar = 6;
int maxDisplacement;
int currentFrames = 0;
int currentDisplayType = 0;
const int maxFrames = 100;
bool matrixOn = false;
bool turnMatrixOffRequested = false;
bool turnMatrixOnRequested = false;
bool displayAnimation = false;
String animationData[maxFrames];
String lastText;
String lastDesign;

enum class DisplayType:int{
  Text = 1,
  Design = 2
};

struct FunctionCall {
  void (*function)(void);
};

//int displayType = 0; //1 -text, 2-bitmap
//CRGB leds[NUM_LEDS];

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(MATRIX_WIDTH, MATRIX_HEIGHT, MATRIX_PIN,
  NEO_MATRIX_TOP     + NEO_MATRIX_LEFT +
  NEO_MATRIX_COLUMNS + NEO_MATRIX_ZIGZAG,
  NEO_GRB            + NEO_KHZ800
);

Adafruit_NeoPixel pixel = Adafruit_NeoPixel(1, RGB_PIN, NEO_GRB);

const uint16_t colors[] = {
  matrix.Color(255, 0, 0), matrix.Color(0, 255, 0), matrix.Color(0, 0, 255), matrix.Color(0, 0, 0)
};

////////////////////////////// BLE globals //////////////////////////////
BLEServer* pServer = NULL;
BLEAdvertising *pAdvertising = NULL;
BLECharacteristic* pTextCharacteristic = NULL;
BLECharacteristic* pSetupCharacteristic = NULL;
BLECharacteristic* pDesignCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint32_t value = 0;

void playAnimation() {
  matrixOn = true;
  for (int i = 0; i < currentFrames; i++) {
    stringToBitmap(animationData[i]);
    delay(100);
  }
}

void printFreeMemory() {
  Serial.print("Free memory: ");
  Serial.println(ESP.getFreeHeap());
}

void setMatrixBrightness(String value) {
  if (!matrixOn) return;
  int brightnessValue = value.toInt();
  if (brightnessValue < 0 || brightnessValue > MAX_BRIGHTNESS) return;
  matrix.setBrightness(brightnessValue);
  matrix.show();
}

void stringToBitmap(String receivedData) {
  // Allocate memory for the bitmap array
  uint16_t* bitmap = new uint16_t[MATRIX_WIDTH * MATRIX_HEIGHT];
  memset(bitmap, 0, MATRIX_WIDTH * MATRIX_HEIGHT * sizeof(uint16_t));
  size_t bitmapIndex = 0;
  // Iterate through the received data to extract color values
  for (size_t i = 0; i < receivedData.length(); i += 3) {
    String pixelColorStr = receivedData.substring(i, i + 3); // Extract color string
    uint16_t pixelColor = parseShortHexColor(pixelColorStr); // Parse color string to uint16_t
    bitmap[bitmapIndex++] = pixelColor; // Store color in bitmap array
  }
  // Draw the bitmap on the matrix using drawRGBBitmap function
  matrix.drawRGBBitmap(0, 0, bitmap, MATRIX_WIDTH, MATRIX_HEIGHT);
  matrix.show(); // Show the updated matrix
  // Clean up memory
  delete[] bitmap;
}

void setMatrixDesign(String receivedData) {
  preferences.begin("matrix_prefs", false);
  preferences.putString("lastDesign", receivedData);
  preferences.putInt("displayType", int(DisplayType::Design));
  preferences.end();
  matrixOn = true;
  stringToBitmap(receivedData);
}

uint16_t parseShortHexColor(String colorStr) {
  // Convert RGB color string to RRGGBB format
  String rStr = String(colorStr[0]) + colorStr[0];
  String gStr = String(colorStr[1]) + colorStr[1];
  String bStr = String(colorStr[2]) + colorStr[2];

  // Convert hex color string to uint16_t RGB565 color value
  uint16_t r = strtol(rStr.c_str(), NULL, 16);
  uint16_t g = strtol(gStr.c_str(), NULL, 16);
  uint16_t b = strtol(bStr.c_str(), NULL, 16);

  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

uint16_t parseHexColor(String colorStr) {
  // Convert RGB color string to RRGGBB format
  String rStr = colorStr.substring(0,2);
  String gStr = colorStr.substring(2,4);
  String bStr = colorStr.substring(4,6);;

  // Convert hex color string to uint16_t RGB565 color value
  uint16_t r = strtol(rStr.c_str(), NULL, 16);
  uint16_t g = strtol(gStr.c_str(), NULL, 16);
  uint16_t b = strtol(bStr.c_str(), NULL, 16);

  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

void setMatrixText(String message) {
  preferences.begin("matrix_prefs", false);
  preferences.putString("lastText", message);
  preferences.putInt("displayType", int(DisplayType::Text));
  preferences.end();
  String textColor = message.substring(0,6);
  String text = message.substring(6);
  matrix.setTextColor(parseHexColor(textColor));
  //maxDisplacement = message.length() * pixelPerChar + matrix.width();
  //Serial.println("DISP TYPE LEN: ");
  //Serial.println(preferences.putInt("displayType", 1));
  //if (message.length())
  matrix.fillScreen(0);
  matrix.setCursor(0,0);
  matrix.print(text);
  matrix.show();
  matrixOn = true;
}

void turnMatrixOff() {
  if (!matrixOn) return;
  displayAnimation = false;
  matrix.clear();
  matrix.show();
  matrixOn = false;
  Serial.println("Turning off...");
}

void turnMatrixOn() {
  if (matrixOn) return;
  preferences.begin("matrix_prefs", true);
  currentDisplayType = preferences.getInt("displayType");
  if (currentDisplayType == int(DisplayType::Text)) {
    lastText = preferences.getString("lastText");
    if(lastText) setMatrixText(lastText);
  }
  else if (currentDisplayType == int(DisplayType::Design)) {
    lastDesign = preferences.getString("lastDesign");
    if(lastDesign) setMatrixDesign(lastDesign);
  } else setMatrixText("FFFFFFOn");
  preferences.end();
  matrixOn = true;
  Serial.println("Turning on...");
}

void printInfo() {
  Serial.println("<<<<<<<<<<<< Data stored on ESP32 >>>>>>>>>>>>>>>\n");
  Serial.print("Last text: ");
  Serial.println("#" + lastText.substring(0,6) + " " + lastText.substring(6));
  Serial.print("Last design: ");
  Serial.println(lastDesign.substring(0,3) + " frames, " + lastDesign.substring(3));
  Serial.print("Display type: ");
  Serial.println(currentDisplayType);
  Serial.println("\n<<<<<<<<<<<<<<<<<<<<< END >>>>>>>>>>>>>>>>>>>>>");
}

void policeCon() {
  pixel.setPixelColor(0, colors[0]);
  pixel.show();    // Red
  delay(200);
  pixel.setPixelColor(0, colors[2]);
  pixel.show();     // Blue
  delay(200);
}

void MyServerCallbacks::onConnect(BLEServer* pServer) {
  deviceConnected = true;
}

void MyServerCallbacks::onDisconnect(BLEServer* pServer) {
  deviceConnected = false;
}

void MyDesignCallbacks::onWrite(BLECharacteristic *pDesignCharacteristic) {
  if (!matrixOn) return;
  displayAnimation = false;
  String receivedValue = String(pDesignCharacteristic->getValue().c_str());

  Serial.println("\n=====BITMAP=====");
  if (receivedValue.length() > 0 && receivedValue.length() % 3 == 0) {
    int numFrames = receivedValue.substring(0,3).toInt();
    if (numFrames > 100 || numFrames < 1) {
      Serial.println("Invalid number of frames!");
      return;
    }
    if (numFrames == 1) {
      String pixelData = receivedValue.substring(3, receivedValue.length());
      setMatrixDesign(pixelData);
    } else {
      String animationFrames = receivedValue.substring(3);
      for (int i = 0; i < numFrames; i++) {
        animationData[i] = animationFrames.substring(0, DESIGN_LENGTH);
        animationFrames = animationFrames.substring(DESIGN_LENGTH);
      }
      Serial.println("===ANIMATION===");
      displayAnimation = true;
    }
    Serial.println(receivedValue.substring(0,3) + " frames, " + receivedValue.substring(3));
    Serial.println("=====BITMAP=====\n");
  }
  else Serial.println("Invalid format for design!");
}

void MyTextCallbacks::onWrite(BLECharacteristic *pTextCharacteristic) {
  if (!matrixOn) return;
  displayAnimation = false;
  String receivedValue = String(pTextCharacteristic->getValue().c_str());
  if (receivedValue.length() > 0) {
    Serial.println("\n=====TEXT=====");
    Serial.print("#");
    for (int i = 0; i < 6; i++) {
      Serial.print(receivedValue[i]);
    }
    Serial.print(" ");
    for (int i = 6; i < receivedValue.length(); i++) {
      Serial.print(receivedValue[i]);
    }
    setMatrixText(receivedValue);
    Serial.println("\n=====TEXT=====\n");
  }
}

void MySetupCallbacks::onWrite(BLECharacteristic *pSetupCharacteristic) {
  String receivedValue = String(pSetupCharacteristic->getValue().c_str());
  if (receivedValue.length() > 0) {
    if (receivedValue == "Off") turnMatrixOffRequested = true;
    else if (receivedValue == "On") turnMatrixOnRequested = true;
    else if (receivedValue.length() == 2 || receivedValue.length() == 3) {
      if (receivedValue[0] == 'B') {
        if (receivedValue[2]) {
          setMatrixBrightness(receivedValue.substring(1,3));
        } else {
          setMatrixBrightness(receivedValue.substring(1,2));
        }
      } 
    } else {
      Serial.println("Incorrect command: " + receivedValue);
    }
  }
}

void setup() {
  preferences.begin("matrix_prefs", true);
  lastText = preferences.getString("lastText");
  lastDesign = preferences.getString("lastDesign");
  currentDisplayType = preferences.getInt("displayType");
  preferences.end();
  Serial.begin(115200);
  while(!Serial && millis()<4000) { /* wait for serial connect, for up to 4 sec */ }
  printInfo();
  pixel.begin();
  pixel.setBrightness(50);
  pixel.clear();
  matrix.begin();
  matrix.setTextWrap(false); 
  //matrix.setFont(&atawi8c); // Bold font
  matrix.setBrightness(BRIGHTNESS);
  matrix.clear();
  turnMatrixOn();
  Serial.println("Matrix setup successful!");

  // Create the BLE Device
  BLEDevice::init("ESP32-LED");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService* pService = pServer->createService(SERVICE_UUID);

  // Create the BLE Text Characteristic
  BLECharacteristic *pTextCharacteristic = pService->createCharacteristic(
    TEXT_CHARACTERISTIC_UUID, 
    BLECharacteristic::PROPERTY_NOTIFY |
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  pTextCharacteristic->addDescriptor(new BLE2902());
  pTextCharacteristic->setCallbacks(new MyTextCallbacks());

// Create the BLE Design Characteristic
  BLECharacteristic *pDesignCharacteristic = pService->createCharacteristic(
    DESIGN_CHARACTERISTIC_UUID, 
    BLECharacteristic::PROPERTY_NOTIFY |
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  pDesignCharacteristic->addDescriptor(new BLE2902());
  pDesignCharacteristic->setCallbacks(new MyDesignCallbacks());

  // Create the BLE Setup Characteristic
  BLECharacteristic *pSetupCharacteristic = pService->createCharacteristic(
    SETUP_CHARACTERISTIC_UUID, 
    BLECharacteristic::PROPERTY_NOTIFY |
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  pSetupCharacteristic->setCallbacks(new MySetupCallbacks());

  // Start the service
  pService->start();
  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  pAdvertising->start();
  Serial.println("Waiting a client connection to notify...");
}

void loop() {
  if (deviceConnected) {
    if (displayAnimation) {
      playAnimation();
    }
    if (turnMatrixOnRequested) {
      turnMatrixOn();
      turnMatrixOnRequested = false;
    }
    if (turnMatrixOffRequested) {
      turnMatrixOff();
      turnMatrixOffRequested = false;
    }
  } else { // disconnected
    policeCon();
  }
  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    delay(200);                   // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising();  // restart advertising
    Serial.println("Started advertising");
    oldDeviceConnected = deviceConnected;
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected) {
    pixel.setPixelColor(0,colors[2]);
    pixel.show();
    oldDeviceConnected = deviceConnected;
  }
}