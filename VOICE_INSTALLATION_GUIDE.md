# How to Get More Voices for Vemo

Vemo uses your system's built-in text-to-speech voices. Here's how to get more voices on different platforms:

## 🪟 Windows

### Method 1: Windows Settings (Recommended)
1. Open **Settings** (Win + I)
2. Go to **Time & Language** → **Speech**
3. Click **Manage voices**
4. Click **Add voices**
5. Download voices you want (look for "Natural" or "Neural" voices for best quality)

### Method 2: Microsoft Store
1. Open **Microsoft Store**
2. Search for "language pack" or "speech voices"
3. Download language packs that include speech voices
4. Recommended voices:
   - Microsoft David (English US - Male)
   - Microsoft Mark (English US - Male)
   - Microsoft Zira (English US - Female)
   - Microsoft George (English UK - Male)
   - Microsoft Hazel (English UK - Female)

### Method 3: Control Panel (Legacy)
1. Open **Control Panel**
2. Go to **Clock and Region** → **Language**
3. Add a language
4. Click **Options** → Download speech recognition

## 🍎 macOS

### Built-in Voices
1. Open **System Settings** (or System Preferences)
2. Go to **Accessibility** → **Spoken Content**
3. Click **System Voice** dropdown
4. Click **Manage Voices...**
5. Download additional voices

### Recommended macOS Voices:
- **Alex** (English US - Male) - Default, very natural
- **Samantha** (English US - Female) - Natural
- **Daniel** (English UK - Male) - Professional
- **Karen** (English Australia - Female)
- **Premium Voices** (if available):
  - Siri voices (requires macOS Monterey or later)
  - Enhanced quality voices

### Terminal Method (Advanced)
```bash
# List all available voices
say -v ?

# Download a specific voice (example)
# Go to System Settings → Accessibility → Spoken Content → Manage Voices
```

## 🐧 Linux

### Ubuntu/Debian
```bash
# Install espeak (basic)
sudo apt-get install espeak

# Install Festival (better quality)
sudo apt-get install festival festvox-kallpc16k

# Install MBROLA voices (high quality)
sudo apt-get install mbrola mbrola-us1 mbrola-us2 mbrola-us3
```

### Fedora/RHEL
```bash
sudo dnf install espeak festival
```

### Using Speech Dispatcher
```bash
sudo apt-get install speech-dispatcher
spd-say -L  # List available voices
```

## 🌐 Chrome/Edge Browser Voices

If you're using Vemo in a web browser, you can also get voices through:

### Chrome Web Store
1. Search for "Voice" or "TTS" extensions
2. Some extensions add additional voices
3. Note: These may not integrate with the Web Speech API

### Online TTS Services (Alternative)
- Google Cloud Text-to-Speech
- Amazon Polly
- Microsoft Azure Speech Services
(These require API integration and are not currently used by Vemo)

## 🎯 Best Voices for Vemo (Professional Network Engineer)

### Windows:
- **Microsoft David Desktop** - Deep, authoritative male voice
- **Microsoft Mark** - Professional male voice
- **Microsoft George** - British male voice (formal)

### macOS:
- **Alex** - Natural, professional male voice
- **Daniel (UK)** - Formal British male voice
- **Tom** - Clear American male voice

### Quality Tiers:
1. **Neural/Natural voices** - Highest quality, most human-like
2. **Premium voices** - High quality, clear
3. **Standard voices** - Basic quality, robotic

## 🔧 Troubleshooting

### Voice Not Appearing in Vemo?
1. Restart your browser after installing new voices
2. Check if the voice is enabled in system settings
3. Try the "Test Voice" button in Vemo settings
4. Some voices only work in specific browsers

### Voice Sounds Robotic?
- Try downloading "Neural" or "Natural" versions
- Adjust speech rate (slower = more natural)
- Adjust pitch (0.9-1.0 for professional tone)

### No Voices Available?
- Windows: Install at least one language pack with speech
- macOS: Download at least one voice in Accessibility settings
- Linux: Install espeak or festival packages

## 📝 Current Vemo Voice Settings

Vemo is configured to automatically select:
1. Professional male voices (David, Mark, Daniel, Alex)
2. Natural/Neural voices (highest quality)
3. English (US/UK) voices
4. Default system voice as fallback

You can manually change the voice in Vemo:
1. Click the **⋮** menu button
2. Select **Voice Settings**
3. Choose from all available voices
4. Adjust speed and pitch
5. Click **Test Voice** to preview

## 🎤 Voice Quality Tips

For the best Vemo experience:
- **Speech Rate**: 0.9-1.0 (professional pace)
- **Pitch**: 0.8-1.0 (authoritative tone)
- **Volume**: 0.9-1.0 (clear but not harsh)

## 🔗 Additional Resources

- [Microsoft Speech Platform](https://www.microsoft.com/en-us/download/details.aspx?id=27224)
- [macOS Voice Downloads](https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac)
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

**Note**: Vemo uses the Web Speech API, which relies on your operating system's installed voices. The quality and availability of voices depend on your OS and installed language packs.
