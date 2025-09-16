// dashboard.js
import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Get the logged-in class from browser memory
const loggedInClass = localStorage.getItem('loggedInClass');
if (!loggedInClass) {
    // If no one is logged in, redirect back to login page
    window.location.href = 'index.html';
}

document.getElementById('welcome-message').textContent = `Welcome, ${loggedInClass}!`;

// --- BARCODE SCANNER LOGIC ---
function onScanSuccess(decodedText, decodedResult) {
    // decodedText will be something like "CAS01"
    console.log(`Code matched = ${decodedText}`, decodedResult);
    
    // Logic to save attendance
    saveAttendance(decodedText);
    
    // Optional: Stop scanning after one successful scan
    // html5QrcodeScanner.clear();
}

let html5QrcodeScanner = new Html5QrcodeScanner(
	"reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);


// --- FUNCTION TO SAVE ATTENDANCE TO FIREBASE ---
async function saveAttendance(barcodeData) {
    try {
        const classId = barcodeData.substring(0, barcodeData.indexOf('S')).slice(-1); // Extracts 'A' from 'CAS'
        const studentId = barcodeData.substring(barcodeData.indexOf('S')); // Extracts 'S01'

        const docRef = await addDoc(collection(db, "attendance"), {
            class: `class${classId}`,
            student: studentId,
            timestamp: new Date() // Adds the current date and time
        });
        alert(`Attendance marked for ${barcodeData}!`);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error marking attendance.");
    }
}


// --- FUNCTION TO VIEW ATTENDANCE ---
const viewAttendanceBtn = document.getElementById('viewAttendanceBtn');
const attendanceDataContainer = document.getElementById('attendance-data');

viewAttendanceBtn.addEventListener('click', async () => {
    attendanceDataContainer.innerHTML = '<h3>Attendance Records:</h3>'; // Clear previous data
    
    const q = query(collection(db, "attendance"), where("class", "==", loggedInClass));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        attendanceDataContainer.innerHTML += '<p>No records found.</p>';
        return;
    }
    
    let table = '<table><tr><th>Student</th><th>Time</th></tr>';
    querySnapshot.forEach((doc) => {
        const record = doc.data();
        const time = record.timestamp.toDate().toLocaleString(); // Format timestamp
        table += `<tr><td>${record.student}</td><td>${time}</td></tr>`;
    });
    table += '</table>';
    attendanceDataContainer.innerHTML += table;
});