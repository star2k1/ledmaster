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

String MemoryFunctions::serializeVector(const std::vector<String>& animation) {
    if (animation.empty()) return "";
    String result;
    for (size_t i = 0; i < animation.size(); ++i) {
        result += animation[i];
        if (i < animation.size() - 1) result += '|';
    }
    return result;
}

std::vector<String> MemoryFunctions::deserializeVector(const String& serAnimation) {
    std::vector<String> result;
    if (serAnimation.length() == 0) return result;
    const char delimiter = '|';
    size_t startPos = 0;
    size_t endPos = serAnimation.indexOf(delimiter);
    while (endPos != -1) {
        result.push_back(serAnimation.substring(startPos, endPos));
        startPos = endPos + 1;
        endPos = serAnimation.indexOf(delimiter, startPos);
    }
    result.push_back(serAnimation.substring(startPos));
    return result;
}

std::vector<String> MemoryFunctions::getAnimation() {
    prefs.begin("matrix_prefs", true);
    bool isAvailable = prefs.isKey("animationData");
    if (!isAvailable) return std::vector<String>();
    std::vector<String> animation = deserializeVector(prefs.getString("animationData"));
    prefs.end();
    return animation;
}

void MemoryFunctions::saveAnimation(std::vector<String> animationData) {
    prefs.begin("matrix_prefs", false);
    prefs.putString("animationData", serializeVector(animationData));
    prefs.end();
}