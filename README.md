
# BLE controlled LED matrix ESP32

BLE controlled LED matrix is project that aims to create an open source application to control various LED matrices over Bluetooth Low Energy. 

This is the branch that contains ESP32 code for the BLE controlled LED matrix repository.

Currently the application supports only WS2812B 8x32 LED Matrix. Support for other matrices will be added later.

Code is written for the ESP32 Arduino platform using PlatformIO VSCode extension.




## Features

- BLE connection with a mobile device
- Show bitmaps, animations, text on matrix
- Turn matrix on/off
- Change brightness of matrix


## Installation

Prerequisites: 
- ESP32-S3 (tested on DevKitC N8R8)
- VSCode with PlatformIO extension
- Libraries:
    - Adafruit_GFX
    - Adafruit_NeoPixel
    - Adafruit_NeoMatrix
    - Preferences.h
    - BLEDevice
    - BLE2902

1. Clone controller repository into VSCode
2. Compile and upload the code to the ESP32 using PlatformIO
    
## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)


## Authors

- [@star2k1](https://www.github.com/star2k1)

