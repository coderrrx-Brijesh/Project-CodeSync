# 🚀 CodeSync

**CodeSync** is a lightweight and flexible code execution platform that allows running code written in different programming languages directly on your machine. It executes code **locally using child processes**, ensuring fast and real-time feedback. Perfect for coding platforms, collaborative tools, or learning environments.

---

## 🔧 Features

- 💻 Multi-language support (C++, Python, JavaScript, etc.)
- ⚙️ Local execution using Node.js `child_process`
- 🔁 Real-time output
- 🛠️ Extendable architecture
- ⚡ Simple and fast, no need for cloud compilation

---

## 🧠 How It Works

CodeSync uses Node.js’s built-in `child_process` module to:

1. Save the user-submitted code into a temporary file.
2. Spawn a process to compile (if needed) and execute the file.
3. Return the output or error.

This means that **you must have the respective language's compiler/interpreter installed on your machine**.

---

## 🌐 Supported Languages & Requirements

| Language       | Required to be Installed | Sample Command Used Internally   |
| -------------- | ------------------------ | -------------------------------- |
| **C++**        | `g++`                    | `g++ file.cpp -o file && ./file` |
| **Python**     | `python3`                | `python3 file.py`                |
| **JavaScript** | `node`                   | `node file.js`                   |
| **Java**       | `javac`, `java`          | `javac file.java && java file`   |
| **Go**         | `go`                     | `go run file.go`                 |
| **Ruby**       | `ruby`                   | `ruby file.rb`                   |
| **PHP**        | `php`                    | `php file.php`                   |

Install them using the following commands (for Linux/macOS):

```bash
# C++
sudo apt install g++

# Python
sudo apt install python3

# JavaScript (Node.js)
sudo apt install nodejs

# Java
sudo apt install default-jdk

# Go
sudo apt install golang

# Ruby
sudo apt install ruby

# PHP
sudo apt install php
```
