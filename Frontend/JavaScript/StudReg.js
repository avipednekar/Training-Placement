let studentData;

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    studentData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        rollNo: document.getElementById('rollNo').value,
        branch: document.getElementById('branch').value,
        password: document.getElementById('password').value
    };

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    });

    const result = await response.json();
    alert(result.message); 
});