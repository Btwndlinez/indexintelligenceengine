# Sparky Wiz — Brand & Asset Specification

For designers and asset creation.

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Background Dark** | `#0a0a1a` | App background, splash background |
| **Primary Cyan** | `#4fc3f7` | Lightning bolt, accent elements, active states |
| **White** | `#ffffff` | Text on dark backgrounds |
| **Card Dark** | `#111111` | Card backgrounds |
| **Success Green** | `#66bb6a` | PASS states, positive indicators |
| **Error Red** | `#ef5350` | FAIL states, negative indicators |

## Typography

- **App Name**: Clean sans-serif (e.g., Inter, SF Pro, Roboto)
- **Weights**: Regular for body, Bold for headlines

## Icon Design Guidelines

### iOS App Icon
- **Size**: 1024×1024px
- **Shape**: Rounded square (iOS automatically rounds corners)
- **Background**: Dark blue `#0a0a1a` or a subtle gradient
- **Foreground**: Stylized lightning bolt in `#4fc3f7`
- **No text**: App name is displayed by iOS under the icon

### Android Adaptive Icon
- **Foreground**: Lightning bolt on transparent background (1024×1024px)
- **Background**: Solid `#0a0a1a` (1024×1024px)
- **Safe zone**: Keep bolt within 66×66dp center (don't reach edges)

## Assets Directory

```
assets/
├── icon.png              (1024×1024, iOS icon)
├── adaptive-icon.png     (1024×1024, Android adaptive foreground)
├── adaptive-background.png (1024×1024, Android adaptive background)
├── splash.png            (1242×2438, launch screen)
└── favicon.png           (512×512, web favicon)
```

## Required Deliverables for App Store

### iOS
- 6.5" iPhone screenshots (1242×2688)
- 5.5" iPhone screenshots (1242×2208)
- iPad Pro screenshots (2048×2732)
- App Store icon (1024×1024)

### Android
- Phone screenshots (1080×1920)
- 7" tablet screenshots (1200×1920)
- 10" tablet screenshots (1200×1920)
- Feature graphic (1024×500)

---

**Note**: Current assets in `assets/` are placeholders generated programmatically.
Replace with real designer assets before submission.
