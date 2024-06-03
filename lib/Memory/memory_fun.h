#pragma once
#include "Arduino.h"
#include "Preferences.h"
#include <vector>

extern Preferences prefs;

class MemoryFunctions {

    private:
        String serializeVector(const std::vector<String>& animation);
        std::vector<String> deserializeVector(const String& serAnimation);

    public:
        String getDesign();
        void saveDesign(String lastDesign);

        String getText();
        void saveText(String lastText);

        int getCurrentDisplayType();
        void saveCurrentDisplayType(int displayType);

        bool getScrollStatus();
        void saveScrollStatus(bool scrollStatus);

        bool getAnimationStatus();
        void saveAnimationStatus(bool animationStatus);

        std::vector<String> getAnimation();
        void saveAnimation(std::vector<String> animationData);

};