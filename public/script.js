const videoElem = document.getElementById("preview");
const statusElem = document.getElementById("status");

function onScanSuccess(decodedText) {
  statusElem.innerText = "Scanned: " + decodedText;

  // Send to backend
  fetch("/mark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: decodedText, time: new Date().toLocaleString() })
  })
    .then(res => res.json())
    .then(data => {
      statusElem.innerText = data.message;
    });
}

function onScanFailure(error) {
  // ignore scan errors
}

let html5QrcodeScanner = new Html5QrcodeScanner(
  "preview", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess, onScanFailure);
