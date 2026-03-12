const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const appointmentsFile = path.join(dataDir, 'appointments.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(appointmentsFile)) {
  fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2));
}

app.use(express.json());
app.use(express.static(publicDir));

app.get('/api/appointments', (req, res) => {
  try {
    const data = fs.readFileSync(appointmentsFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Unable to load appointments.' });
  }
});

app.post('/api/appointments', (req, res) => {
  const { name, phone, email, service, notes } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({
      message: 'Please fill all required details (Name, Phone, Email).'
    });
  }

  try {
    const existing = JSON.parse(fs.readFileSync(appointmentsFile, 'utf8'));

    const appointment = {
      id: Date.now(),
      name,
      phone,
      email,
      service: service || 'Enquiry',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    existing.push(appointment);
    fs.writeFileSync(appointmentsFile, JSON.stringify(existing, null, 2));

    res.status(201).json({
      message: 'Enquiry received successfully.',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to save enquiry.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Sharrix Studios website is running on http://localhost:${PORT}`);
});
