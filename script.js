const imageInput = document.getElementById("userImage");
const preview = document.getElementById("preview");
const fileName = document.getElementById("fileName");
const today = new Date();

function getLocation() {
    return new Promise((resolve, reject) => {

        navigator.geolocation.getCurrentPosition(
            (position) => {

                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });

            },
            (error) => {
                reject(error);
            }
        );

    });
}

const allowedLocation = {
    lat: 28.848620,
    lon: 77.573760


};

const allowedRadius = 200; // meters
function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371000; // Earth radius in meters

    const dLat = (lat2-lat1) * Math.PI / 180;
    const dLon = (lon2-lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) *
        Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}


async function verifyLocation(){

    try {
        const userLocation = await getLocation();

        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            allowedLocation.lat,
            allowedLocation.lon
        );

        if(distance <= allowedRadius){
            return true;
        }

        alert(`You are outside the attendance area.\nDistance: ${Math.round(distance)} meters`);
        return false;

    } catch(error) {
        alert("Please allow location permission to continue.");
        return false;
    }
}

// Show image preview and filename
imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
        preview.style.display = "none";
        fileName.textContent = "No file selected";
        return;
    }

    fileName.textContent = file.name;

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
    };

    reader.readAsDataURL(file);
});

function getFormData() {
        return {
            name: document.getElementById("name").value.trim(),
            college: document.getElementById("college").value.trim(),
            branch: document.getElementById("branch").value.trim(),
            email: document.getElementById("email").value.trim(),
            date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
        };
    }

async function generateAndSend() {

    if (imageInput.files.length === 0) {
        alert("Please capture your photo first.");
        imageInput.click();
        return;
    }

    const data = getFormData();

    if (!data.name || !data.college || !data.branch || !data.email) {
        alert("Please fill all fields");
        return;
    }

    const loader = document.getElementById("loader");
    loader.style.display = "block";

    const isAllowed = await verifyLocation();

    if (!isAllowed) {
        loader.style.display = "none";
        return;
    }

    loader.style.display = "none";


    const qrData = `Name: ${data.name}\nCollege: ${data.college}\nBranch: ${data.branch}\nDate: ${data.date}`;

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

    document.getElementById("downloadContainer")
        .appendChild(btn);

    document.getElementById("downloadContainer")
        .scrollIntoView({behavior:"smooth"});
}

async function downloadQR() {
    const qrCanvas = document.querySelector("#qr canvas");

    if (!qrCanvas) {
        alert("QR not generated yet!");
        return;
    }

    const data = getFormData();

    const uploadedFile = document.getElementById("userImage").files[0];

    // Helper to load image from URL
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Helper to load uploaded image
    function loadUploaded(file) {
        return new Promise((resolve, reject) => {
            if (!file) resolve(null);

            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        });
    }

    const logo = await loadImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJMVYLJAeXrWVF1SHoUExQbmdRmsBy6Nn5iy9IpPXQBg&s=10");
    const userImage = await loadUploaded(uploadedFile);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 850;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let y = 20;

    // ---------------- Logo ----------------
    ctx.drawImage(logo, 50, y, 400, 120);
    y += 150;

    // -------------- Uploaded Image --------------
    if (userImage) {
        ctx.drawImage(userImage, 150, y, 200, 220);
        y += 270;
    }

    // ---------------- Details ----------------
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";

    ctx.fillText(`Name: ${data.name}`, canvas.width / 2, y);
    y += 35;

    ctx.fillText(`College: ${data.college}`, canvas.width / 2, y);
    y += 35;

    ctx.fillText(`Branch: ${data.branch}`, canvas.width / 2, y);
    y += 50;

    // ---------------- QR ----------------
    ctx.drawImage(
        qrCanvas,
        (canvas.width - qrCanvas.width) / 2,
        y
    );

    // Download
    const link = document.createElement("a");
    link.download = "StudentQR.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
