#include "memory_fun.h"

Preferences prefs;

String MemoryFunctions::getDesign() {
    prefs.begin("matrix_prefs", true);
    bool isAvailable = prefs.isKey("lastDesign");
    if (!isAvailable) return "";
    String lastDesign = prefs.getString("lastDesign");
    prefs.end();
    return lastDesign;
}

void MemoryFunctions::saveDesign(String lastDesign) {
    prefs.begin("matrix_prefs", false);
    prefs.putString("lastDesign", lastDesign);
    prefs.end();
}

String MemoryFunctions::getText() {
    prefs.begin("matrix_prefs", true);
    bool isAvailable = prefs.isKey("lastText");
    if (!isAvailable) return "";
    String lastText = prefs.getString("lastText");
    prefs.end();
    return lastText;
}

void MemoryFunctions::saveText(String lastText) {
    prefs.begin("matrix_prefs", false);
    prefs.putString("lastText", lastText);
    prefs.end();
}

int MemoryFunctions::getCurrentDisplayType() {
    prefs.begin("matrix_prefs", true);
    bool isAvailable = prefs.isKey("displayType");
    if (!isAvailable) return 0;
    int currentDisplayType = prefs.getInt("displayType");
    prefs.end();
    return currentDisplayType;
}

void MemoryFunctions::saveCurrentDisplayType(int displayType) {
    prefs.begin("matrix_prefs", false);
    prefs.putInt("displayType", displayType);
    prefs.end();
}

bool MemoryFunctions::getScrollStatus() {
    prefs.begin("matrix_prefs", true);
    bool isAvailable = prefs.isKey("scrollStatus");
    if (!isAvailable) return false;
    bool scrollStatus = prefs.getBool("scrollStatus");
    prefs.end();
    return scrollStatus;
};
    
void MemoryFunctions::saveScrollStatus(bool scrollStatus) {
    prefs.begin("matrix_prefs", false);
    prefs.putBool("scrollStatus", scrollStatus);
    prefs.end();
};

bool MemoryFunctions::getAnimationStatus() {
    prefs.begin("matrix_prefs", true);
    bool isAvailable = prefs.isKey("animationStatus");
    if (!isAvailable) return false;
    bool animationStatus = prefs.getBool("animationStatus");
    prefs.end();
    return animationStatus;
};

void MemoryFunctions::saveAnimationStatus(bool animationStatus) {
    prefs.begin("matrix_prefs", false);
    prefs.putBool("animationStatus", animationStatus);
    prefs.end();
};