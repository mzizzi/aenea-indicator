# Aenea Indicator

![aenea-green](icons/aenea-green.png)![aenea-yellow](icons/aenea-yellow.png)![aenea-red](icons/aenea-red.png)

When using [Aenea](https://github.com/dictation-toolbox/aenea) for dictation on
linux it is sometimes frustrating to not know the state of the microphone.  
This applet allows users to place a microphone icon in a panel that displays 
the current Dragon microphone state.  The applet itself doesn't hook into 
Dragon. Instead its icon color set via dbus method calls.  Typically Aenea will
hook into natlink to get microphone state updates and then make the dbus method 
call to set icon color.

## Installation
```bash
./install.sh
```

## Usage

Valid colors are "idk" | "green" | "yellow" | "red"

```bash
dbus-send \
  --type=method_call \
  --print-reply \
  --dest=com.mhzizzi.AeneaIndicator.Interface \
  /com/mhzizzi/AeneaIndicator/Interface \
  com.mhzizzi.AeneaIndicator.Interface.SetAppletIcon \
  string:green
```
