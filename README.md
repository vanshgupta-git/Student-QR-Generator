# 📌 Student QR Generator

A simple web-based Student QR Code Generator that takes user details (Name, College, Branch, Email), generates a QR code, displays it, and allows downloading it as a single image with embedded details.

---

## 🚀 Features

- Collect student information via form
- Generate QR code dynamically using QRCode.js
- Display encoded data preview
- Download QR as PNG image
- QR + text combined into one image
- Fully frontend-based (no backend required)

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- QRCode.js (CDN)

CDN:
https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js

---

## 📁 Project Structure

student-qr-generator/
│
├── index.html
├── style.css
├── script.js
└── README.md

---

## ⚙️ How It Works

1. User enters Name, College, Branch, Email
2. Clicks "Generate QR"
3. QR code is generated using QRCode.js
4. Data preview is shown below QR
5. Download button appears
6. Clicking download:
   - Captures QR canvas
   - Creates new canvas
   - Adds text below QR
   - Downloads final image as PNG

---

## 📥 Setup Instructions

1. Clone the repository:
git clone https://github.com/your-username/student-qr-generator.git

2. Open index.html in browser

No installation required

---

## 🧠 Core Logic

Get Form Data:
function getFormData() {
    return {
        name: document.getElementById("name").value.trim(),
        college: document.getElementById("college").value.trim(),
        branch: document.getElementById("branch").value.trim(),
        email: document.getElementById("email").value.trim()
    };
}

Generate QR:
new QRCode(document.getElementById("qr"), {
    text: qrData,
    width: 180,
    height: 180
});

---

## 🎯 Example QR Data

Name: Vansh
College: RKGIT
Branch: CSE

---

## 📌 Future Improvements

- Email QR sharing using EmailJS
- WhatsApp QR sharing
- Save data in database
- Better UI dashboard
- Admin panel for tracking QR history

---

## 🤝 Contribution

Pull requests are welcome. For major changes, open an issue first.

---

## 👨‍💻 Author

Vansh