#include <Arduino.h>
#include "ble_matrix.h"

////////////////////////////// Matrix and system globals //////////////////////////////
MemoryFunctions *memfuncs;
int matrixHeight = 0;
int matrixWidth = 0;
int maxDisplacement;
int currentFrameIdx = 0;
int currentDisplayType = 0;
bool matrixOn = false;
bool turnMatrixOffRequested = false;
bool turnMatrixOnRequested = false;
bool displayAnimation = false;
bool saveAnimationRequested = false;
bool scrollText = false;
std::vector<String> animationBuf;
std::vector<String> animationData;
unsigned long prevAnimationMillis = 0;
unsigned long animationInterval = 250;
String lastText;
String lastDesign;
unsigned long prevPoliceMillis = 0;
unsigned long policeInterval = 200;
int policeState = 0;
std::regex hexPattern("^[0-9A-Fa-f]{6}.*$");

enum class DisplayType:int{
  Text = 1,
  Design = 2,
  Animation = 3
};

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
BLECharacteristic* pAnimationCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint32_t value = 0;

////////////////////////////// Text globals //////////////////////////////
int pixelPerChar = 6; // Width of Standard Font Characters is 8X6 Pixels
int x = matrix.width(); // Width of the Display
unsigned long prevTextMillis = 0;
unsigned long scrollInterval = 55; // Interval between updates in milliseconds

void setScrollingText() {
  matrixOn = true;
  matrix.setTextColor(parseHexColor(lastText.substring(0,6)));
  String msg = lastText.substring(6);
  int msgSize = (msg.length() * pixelPerChar); // CALCULATE message length;
  int scrollingMax = (msgSize) + matrix.width(); // ADJUST Displacement for message length;
  unsigned long currentMillis = millis();
  if (currentMillis - prevTextMillis >= scrollInterval) {
    matrix.fillScreen(0); // BLANK the Entire Screen;
    matrix.setCursor(x, 0); // Set Starting Point for Text String;
    matrix.print(msg); // Set the Message String;
    if( --x < -scrollingMax ) {
      x = matrix.width();
    }
    matrix.show();
    prevTextMillis = currentMillis;
  }
}

void playAnimation() {
  matrixOn = true;
  static int currentFrame = 0;
  unsigned long currentTime = millis();
  if (currentTime - prevAnimationMillis >= animationInterval) {
    stringToBitmap(animationData[currentFrame].substring(3)); // Convert the string to bitmap and display it
    prevAnimationMillis = currentTime; // Update the last animation time
    currentFrame++; // Move to the next frame
    if (currentFrame >= animationData.size()) {
      currentFrame = 0;
    }
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
  for (size_t i = 0; i < receivedData.length(); i += 6) {
    String pixelColorStr = receivedData.substring(i, i + 6); // Extract color string
    uint16_t pixelColor = parseHexColor(pixelColorStr); // Parse color string to uint16_t
    bitmap[bitmapIndex++] = pixelColor; // Store color in bitmap array
  }
  matrix.drawRGBBitmap(0, 0, bitmap, MATRIX_WIDTH, MATRIX_HEIGHT);
  matrix.show(); // Show the updated matrix
  delete[] bitmap;
}

void setMatrixDesign(String receivedData) {
  memfuncs->saveDesign(receivedData);
  memfuncs->saveCurrentDisplayType(int(DisplayType::Design));
  matrixOn = true;
  stringToBitmap(receivedData);
}

uint16_t parseHexColor(String colorStr) {
  // Convert hex color string to uint16_t RGB565 color value
  uint16_t r = strtol(colorStr.substring(0,2).c_str(), NULL, 16);
  uint16_t g = strtol(colorStr.substring(2,4).c_str(), NULL, 16);
  uint16_t b = strtol(colorStr.substring(4,6).c_str(), NULL, 16);

  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

void setMatrixText(String message) {
  if (!std::regex_match(message.c_str(), hexPattern)) {
    Serial.println("Invalid text format");
    return;
  } 
  memfuncs->saveText(message);
  memfuncs->saveCurrentDisplayType(int(DisplayType::Text));
  matrix.setTextColor(parseHexColor(message.substring(0,6)));
  matrix.fillScreen(0);
  matrix.setCursor(0,0);
  matrix.print(message.substring(6));
  matrix.show();
  matrixOn = true;
}

void turnMatrixOff() {
  if (!matrixOn) return;
  displayAnimation = false;
  scrollText = false;
  memfuncs->saveAnimationStatus(displayAnimation);
  memfuncs->saveScrollStatus(scrollText);
  matrix.clear();
  matrix.show();
  matrixOn = false;
  Serial.println("Turning off...");
}

void turnMatrixOn() {
  if (matrixOn) return;
  currentDisplayType = memfuncs->getCurrentDisplayType();
  if (currentDisplayType == int(DisplayType::Text)) {
    lastText = memfuncs->getText();
    if (lastText) setMatrixText(lastText);
  } else if (currentDisplayType == int(DisplayType::Design)) {
    lastDesign = memfuncs->getDesign();
    if (lastDesign) setMatrixDesign(lastDesign);
  } else if (currentDisplayType == int(DisplayType::Animation)) {
    animationData = memfuncs->getAnimation();
    if (!animationData.empty()) displayAnimation = true;
  } else setMatrixText("FFFFFFOn");
  matrixOn = true;  
  Serial.println("Turning on...");
}

void saveAnimation() {
  memfuncs->saveAnimation(animationBuf);
  animationData = animationBuf;
  animationBuf.clear();
  saveAnimationRequested = false;
  memfuncs->saveCurrentDisplayType(int(DisplayType::Animation));
  displayAnimation = true;
}

void printInfo() {
  Serial.println("<<<<<<<<<<<< Data stored on ESP32 >>>>>>>>>>>>>>>\n");
  Serial.print("Last text: ");
  Serial.println("#" + lastText.substring(0,6) + " " + lastText.substring(6));
  Serial.print("Display type: ");
  Serial.println(currentDisplayType);
  Serial.println("\n<<<<<<<<<<<<<<<<<<<<< END >>>>>>>>>>>>>>>>>>>>>");
}

void initOnboardLed() {
  pixel.begin();
  pixel.setBrightness(50);
  pixel.clear();
}

void initMatrix() {
  matrix.begin();
  matrix.setTextWrap(false); 
  matrix.setFont(&atawi8c); // Bold font
  matrix.setBrightness(BRIGHTNESS);
  matrix.clear();
  turnMatrixOn();
  Serial.println("Matrix setup successful!");
}

void initBle() {
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

  // Create the BLE Animation Characteristic
  BLECharacteristic *pAnimationCharacteristic = pService->createCharacteristic(
    ANIMATION_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_NOTIFY |
    BLECharacteristic::PROPERTY_READ | 
    BLECharacteristic::PROPERTY_WRITE
  );
  pAnimationCharacteristic->addDescriptor(new BLE2902());
  pAnimationCharacteristic->setCallbacks(new MyAnimationCallbacks());

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

void policeBlink() {
  unsigned long currentMillis = millis();
  if (currentMillis - prevPoliceMillis >= policeInterval) {
    switch (policeState) {
      case 0:
        pixel.setPixelColor(0, colors[0]); // Red
        break;
      case 1:
        pixel.setPixelColor(0, colors[2]); // Blue
        break;
    }
    pixel.show();
    policeState = (policeState + 1) % 2;
    prevPoliceMillis = currentMillis;
  }
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
  memfuncs->saveAnimationStatus(displayAnimation);
  memfuncs->saveScrollStatus(scrollText);
  String receivedValue = String(pDesignCharacteristic->getValue().c_str());
  if (receivedValue.length() > 0 && receivedValue.length() % 6 == 0) {
    animationData.clear();
    scrollText = false;
    setMatrixDesign(receivedValue);
  } else Serial.println("Invalid format for design!");
}

void MyAnimationCallbacks::onWrite(BLECharacteristic *pAnimationCharacteristic) {
  if (!matrixOn) return;
  memfuncs->saveAnimationStatus(displayAnimation);
  memfuncs->saveScrollStatus(scrollText);
  String receivedValue = String(pAnimationCharacteristic->getValue().c_str());
  if (receivedValue.length() > 0 && receivedValue.length() % 3 == 0) {
    int numFrames = receivedValue.substring(0,3).toInt();
    if (numFrames > 100 || numFrames < 1) {
      Serial.println("Invalid number of frames!");
      return;
    } else {
      animationBuf.push_back(receivedValue);
      if (animationBuf.size() >= numFrames) {
        Serial.println("Received animation!");
        displayAnimation = false;
        scrollText = false;
        saveAnimationRequested = true;
        return;
      }
    }
  } else Serial.println("Invalid format for animation!");
}

void MyTextCallbacks::onWrite(BLECharacteristic *pTextCharacteristic) {
  if (!matrixOn) return;
  displayAnimation = false;
  scrollText = false;
  memfuncs->saveAnimationStatus(displayAnimation);
  memfuncs->saveScrollStatus(scrollText);
  String receivedValue = pTextCharacteristic->getValue().c_str();
  if (receivedValue.length() < 7) return;
  Serial.println("\n=====TEXT=====");
  Serial.print("#");
  Serial.println(receivedValue.substring(0,6));
  Serial.print(" ");
  memfuncs->saveText(receivedValue);
  if (receivedValue.length() > 11) {
    lastText = receivedValue;
    scrollText = true;
    memfuncs->saveScrollStatus(scrollText);
  }
  else {
    Serial.println(receivedValue.substring(6));
    setMatrixText(receivedValue);
  }
  Serial.println("\n=====TEXT=====\n");
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
  lastText = memfuncs->getText();
  lastDesign = memfuncs->getDesign();
  currentDisplayType = memfuncs->getCurrentDisplayType();
  scrollText = memfuncs->getScrollStatus();
  displayAnimation = memfuncs->getAnimationStatus();
  if (displayAnimation) animationData = memfuncs->getAnimation();
  Serial.begin(115200);
  while(!Serial && millis()<5000) { /* wait for serial connect, for up to 5 sec */ }
  printInfo();
  initOnboardLed();
  initMatrix();
  initBle();
}

void loop() {
  if (deviceConnected) {
    if (turnMatrixOnRequested) {
      turnMatrixOn();
      turnMatrixOnRequested = false;
    }
    if (turnMatrixOffRequested) {
      turnMatrixOff();
      turnMatrixOffRequested = false;
    }
  } else { // disconnected
    policeBlink();
  }
  if (saveAnimationRequested) saveAnimation();
  if (displayAnimation) playAnimation();
  if (scrollText) setScrollingText();
  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);                   // give the bluetooth stack the chance to get things ready
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