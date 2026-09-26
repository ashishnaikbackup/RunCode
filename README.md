# RunCode 🐍

A simple browser-based Python playground built for learning and running Python code.

## Features

- Python 3 execution directly in the browser
- Code editor with indentation support
- `input()` support through the Input panel
- Output and error console
- `Ctrl + Enter` / `Cmd + Enter` to run
- Copy output
- Responsive layout for mobile and desktop
- No server-side code execution in the current version

## How it works

RunCode uses [Pyodide](https://pyodide.org/), which provides CPython compiled to WebAssembly. Python code runs locally inside the browser tab.

## Roadmap

- Better editor experience
- Code saving and sharing
- Python package support
- C / C++ execution
- JavaScript execution
- SQL playground
- Java execution
- Verilog/SystemVerilog simulation
- AI coding assistant

## Local development

Open `index.html` through a local web server such as VS Code Live Server. An internet connection is required to load Pyodide from its CDN.
