function getFormData() {
        return {
            name: document.getElementById("name").value.trim(),
            college: document.getElementById("college").value.trim(),
            branch: document.getElementById("branch").value.trim(),
            email: document.getElementById("email").value.trim()
        };
    }

function generateAndSend() {
    const data = getFormData();

    if (!data.name || !data.college || !data.branch || !data.email) {
        alert("Please fill all fields");
        return;
    }

    const qrData = `Name: ${data.name}\nCollege: ${data.college}\nBranch: ${data.branch}`;

    document.getElementById("qr").innerHTML = "";
    document.getElementById("details").innerHTML = "";
    document.getElementById("downloadContainer").innerHTML = "";

    new QRCode(document.getElementById("qr"), {
        text: qrData,
        width: 180,
        height: 180
    });

    const details = document.createElement("p");
    details.innerText = qrData;
    document.getElementById("details").appendChild(details);

    const btn = document.createElement("button");
    btn.innerText = "Download QR";
    btn.onclick = downloadQR;

    document.getElementById("downloadContainer").appendChild(btn);
}

function downloadQR() {
    const qrContainer = document.getElementById("qr");
    const qrCanvas = qrContainer.querySelector("canvas");

    if (!qrCanvas) {
        alert("QR not generated yet!");
        return;
    }

    const data = getFormData();
    const qrData = `Name: ${data.name}\nCollege: ${data.college}\nBranch: ${data.branch}`;

    const finalCanvas = document.createElement("canvas");
    const ctx = finalCanvas.getContext("2d");

    finalCanvas.width = qrCanvas.width + 20;
    finalCanvas.height = qrCanvas.height + 100;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    ctx.drawImage(qrCanvas, 10, 10);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";

    qrData.split("\n").forEach((line, i) => {
        ctx.fillText(
            line,
            finalCanvas.width / 2,
            qrCanvas.height + 30 + (i * 18)
        );
    });

    const link = document.createElement("a");
    link.download = "qr-with-details.png";
    link.href = finalCanvas.toDataURL("image/png");
    link.click();
}
