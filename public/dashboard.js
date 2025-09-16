// dashboard.js
import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// --- INITIAL SETUP ---
const loggedInClass = localStorage.getItem('loggedInClass');
if (!loggedInClass) {
    window.location.href = 'index.html';
}
document.getElementById('welcome-message').textContent = `Welcome, ${loggedInClass}!`;

// --- GET HTML ELEMENTS ---
const startScanBtn = document.getElementById('startScanBtn');
const readerDiv = document.getElementById('reader');
const viewAttendanceBtn = document.getElementById('viewAttendanceBtn');
const attendanceDataContainer = document.getElementById('attendance-data');

// --- BARCODE SCANNER SETUP ---
// We create the scanner object but we DON'T start it yet.
const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    saveAttendance(decodedText);
    // The scanner will continue scanning for other students.
}

// --- BUTTON TO START THE 30-MINUTE SESSION ---
startScanBtn.addEventListener('click', () => {
    // Show the scanner video feed
    readerDiv.style.display = 'block';
    
    // Start the camera and scanning
    html5QrcodeScanner.render(onScanSuccess);
    
    // Disable the button to prevent multiple clicks
    startScanBtn.disabled = true;
    startScanBtn.textContent = 'Scanning session in progress...';

    console.log("Scanning session started. It will end in 30 minutes.");
    
    // Set a timer to automatically stop the scanner after 30 minutes
    setTimeout(() => {
        // Stop the scanner and release the camera
        html5QrcodeScanner.clear().then(() => {
            console.log("Scanner cleared successfully.");
        }).catch(error => {
            console.error("Failed to clear scanner.", error);
        });

        // Hide the scanner video feed
        readerDiv.style.display = 'none';

        // Re-enable the button for the next session
        startScanBtn.disabled = false;
        startScanBtn.textContent = 'Start 30-Minute Scanning Session';

        alert("30-minute scanning session has ended.");

    }, 30 * 60 * 1000); // 30 minutes in milliseconds
});


// --- FUNCTION TO SAVE ATTENDANCE TO FIREBASE (remains the same) ---
async function saveAttendance(barcodeData) {
    try {
        const classId = barcodeData.substring(0, barcodeData.indexOf('S')).slice(-1);
        const studentId = barcodeData.substring(barcodeData.indexOf('S'));

        const docRef = await addDoc(collection(db, "attendance"), {
            class: `class${classId}`,
            student: studentId,
            timestamp: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        // We can remove the alert to make scanning multiple students faster
        // alert(`Attendance marked for ${barcodeData}!`); 
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// --- FUNCTION TO VIEW ATTENDANCE (remains the same) ---
viewAttendanceBtn.addEventListener('click', async () => {
    attendanceDataContainer.innerHTML = '<h3>Attendance Records:</h3>';
    const q = query(collection(db, "attendance"), where("class", "==", loggedInClass));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        attendanceDataContainer.innerHTML += '<p>No records found for this class.</p>';
        return;
    }
    
    let table = '<table><tr><th>Student</th><th>Time</th></tr>';
    querySnapshot.forEach((doc) => {
        const record = doc.data();
        const time = record.timestamp.toDate().toLocaleString();
        table += `<tr><td>${record.student}</td><td>${time}</td></tr>`;
    });
    table += '</table>';
    attendanceDataContainer.innerHTML += table;
});
