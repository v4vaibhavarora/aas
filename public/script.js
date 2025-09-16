// Google Apps Script Web App URL
const SHEET_API = "https://script.google.com/macros/s/AKfycbz1oRq8HxMHj2Z1AvXS0tySVDNGP3J-k7NjwbD6WjYf2P3Zp_j4jBC71B5YEUppfEXU/exec";

// Hardcoded login credentials
const USERS = {
  "ClassA": { user: "a", pass: "a123" },
  "ClassB": { user: "b", pass: "b123" },
  "ClassC": { user: "c", pass: "c123" }
};

// --------- LOGIN ----------
function login(e) {
  e.preventDefault();
  const cls = document.getElementById("class").value;
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === USERS[cls].user && p === USERS[cls].pass) {
    localStorage.setItem("class", cls);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}

// -------- DASHBOARD ON LOAD ----------
window.onload = () => {
  const cls = localStorage.getItem("class");
  if (document.getElementById("classname")) {
    document.getElementById("classname").innerText = cls || "No class";
  }
};

// -------- TAKE ATTENDANCE ----------
function startAttendance() {
  document.getElementById("scanner").style.display = "block";
  const codeReader = new ZXing.BrowserBarcodeReader();
  codeReader.decodeFromVideoDevice(null, "preview", (result, err) => {
    if (result) {
      markAttendance(result.text);
    }
  });

  // Stop scanner after 30 minutes
  setTimeout(() => {
    codeReader.reset();
    document.getElementById("scanner").style.display = "none";
    alert("Attendance session ended");
  }, 30 * 60 * 1000);
}

// -------- MARK ATTENDANCE ----------
function markAttendance(studentId) {
  fetch(SHEET_API, {
    method: "POST",
    body: JSON.stringify({
      class: localStorage.getItem("class"),
      student: studentId
    }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.text())
    .then(txt => {
      console.log(txt);
      alert(studentId + " marked Present");
    })
    .catch(err => console.error(err));
}

// -------- VIEW ATTENDANCE ----------
function viewAttendance() {
  fetch(SHEET_API + "?class=" + localStorage.getItem("class"))
    .then(res => res.json())
    .then(data => {
      let table = "<table><tr>";
      data[0].forEach(h => table += "<th>" + h + "</th>");
      table += "</tr>";

      for (let i = 1; i < data.length; i++) {
        table += "<tr>";
        data[i].forEach(c => table += "<td>" + (c || "") + "</td>");
        table += "</tr>";
      }
      table += "</table>";

      document.getElementById("attendance-data").innerHTML = table;
    })
    .catch(err => console.error(err));
}
