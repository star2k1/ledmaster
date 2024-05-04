#pragma once
#include "Arduino.h"
#include "Preferences.h"

extern Preferences prefs;

class MemoryFunctions {

    private:
        const char* prefName;

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
};