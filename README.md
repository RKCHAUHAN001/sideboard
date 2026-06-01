# sideboard 🎨

**sideboard** is a powerful, responsive whiteboard extension for Visual Studio Code designed to help developers visually construct and explain code logic. Whether you're teaching a friend, onboarding a teammate, or mapping out a complex algorithm, **sideboard** provides a dedicated space right next to your code.

![SideBoard Banner](https://github.com/RKCHAUHAN001/sideboard/blob/main/download.gif?raw=true)

## 🚀 Why sideboard?

Explaining complex logic using only text can be difficult. **sideboard** solves this by offering an official, stable Webview-based whiteboard that lives inside your editor. No hacks, no external apps—just pure visual communication.

## ✨ Features

- **Split-Screen Teaching:** Opens in a `Beside` column, allowing you to look at your code on the left and draw explanations on the right.
- **Smart Shape Tools:** Construct logical flowcharts using Rectangles, Squares, Circles, and Triangles.
- **Advanced Eraser System:**
  - **Stroke Eraser:** Classic brush-style erasing for fine-tuning.
  - **Object Eraser:** Select and delete an entire shape or line with a single click.
- **Dynamic Sizing:** A dedicated slider to control the weight/thickness of both your pen and your eraser.
- **Precision Zoom:** Zoom in to focus on details or zoom out to see the entire logic map.
- **Responsive Toolbar:** A modern UI that wraps and stays visible even when the VS Code sidebar is narrow.
- **Visual Feedback:** A custom circular cursor that previews your brush size and turns red when in eraser mode.

## 🛠️ How to Use

1. **Install** the extension.
2. **Open any code file** you want to discuss.
3. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
4. Search for and select: `sideboard: Open Whiteboard`.
5. Start drawing! Use the dropdowns to switch between drawing shapes and erasing mistakes.

## ⌨️ Commands

| Command | Title | Description |
| :--- | :--- | :--- |
| `sideboard.openWhiteboard` | SideBoard: Open Whiteboard | Opens the whiteboard in a split-screen view beside your active editor. |

## 🏗️ Project Structure

The project is built for performance and modularity:
- `extension.js`: Handles activation and VS Code command integration.
- `sideboardUI.js`: Manages the drawing engine, responsive CSS, and UI logic.

## 📜 Stability & Security

Unlike "monkey-patching" extensions, **sideboard** is built using the **Official VS Code Webview API**. This means:
- It will **not** break when VS Code updates.
- It is **100% safe** for the Marketplace.
- It consumes minimal resources and doesn't interfere with your editor's performance.

## 🤝 Contributing

Suggestions and contributions are welcome! If you find a bug or have a feature request (like arrow tools or saving as PNG), feel free to open an issue or a pull request.

---

### Connect with me
=====================
- **LinkedIn**: [Rakesh Chauhan](https://www.linkedin.com/company/parivartya/?viewAsMember=true) - Professional updates
- **Instagram**: [mr.rkchauhan](https://www.instagram.com/mr.rkchauhan/) - Follow and Contact us.
- **YouTube**: [Parivartya Programming](https://www.youtube.com/channel/UCj7XiHMAQPYD0o7_X0tjy_A) - Video tutorials
- **Website**: [Parivartya Corporation](https://parivartya.in) - Also visit the site



**Happy Coding (and Explaining)!** 🚀