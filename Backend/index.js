const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Models/user');
const { default: mongoose } = require('mongoose');
const stripe = require('stripe')('sk_test_51PesjgEivxsvCmzQ9OVNq4WmsPjHZFo3LgBiYaYUN1WTsS468HZ3OHO7Y0WIdAImHsxiyegQ8Z7Erh0TS6OtJeJj00qAoz05RB');
const connectDB = require('./db');
const https = require('https');
const app = express();
const port = process.env.PORT||3000;


// Connect to DB (non-blocking; server runs even if MongoDB is down)
connectDB().catch((err) => {
  console.error('DB init error:', err.message);
});
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Proxy for NPI Registry API (avoids CORS when frontend fetches doctors)
const NPI_BASE = 'https://npiregistry.cms.hhs.gov/api/?version=2.1';
app.get('/api/doctors', (req, res) => {
  const { taxonomy_description, state, city, postal_code, limit } = req.query;
  const params = new URLSearchParams();
  params.set('limit', limit || '50');
  if (taxonomy_description) params.set('taxonomy_description', taxonomy_description);
  if (state) params.set('state', state);
  if (city) params.set('city', city);
  if (postal_code) params.set('postal_code', postal_code);
  const url = `${NPI_BASE}&${params.toString()}`;
  https.get(url, (npiRes) => {
    let data = '';
    npiRes.on('data', (chunk) => { data += chunk; });
    npiRes.on('end', () => {
      try {
        const json = JSON.parse(data);
        res.json(json.results || []);
      } catch (e) {
        res.status(500).json({ message: 'Failed to parse NPI response' });
      }
    });
  }).on('error', (err) => {
    console.error('NPI proxy error:', err);
    res.status(502).json({ message: 'Failed to fetch doctors' });
  });
});

app.post('/register', async (req, res) => {
  const { username, email, password, role, specialty, licenseNumber, bio } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role === 'doctor' ? 'doctor' : 'user',
      ...(role === 'doctor' && { specialty: specialty || '', licenseNumber: licenseNumber || '', bio: bio || '' }),
    });
    await newUser.save();
    const userObj = newUser.toJSON();
    res.status(201).json({ message: 'Registered successfully', user: userObj });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }
    res.status(500).json({ message: 'Error registering', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, 'd6536b58871487e80e0ba4b6d5fd06172d7df77132c95c35f53a93d0ce752749', {
      expiresIn: '1h',
    });

    const userObj = user.toJSON ? user.toJSON() : { _id: user._id, username: user.username, email: user.email, role: user.role || 'user', specialty: user.specialty };
    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Doctor: patients list (mock – replace with real data from appointments when ready)
app.get('/api/doctor/patients', (req, res) => {
  const mockPatients = [
    { id: '1', name: 'John Smith', email: 'john@example.com', lastVisit: '2024-01-15', nextAppointment: '2024-02-20' },
    { id: '2', name: 'Sarah Jones', email: 'sarah@example.com', lastVisit: '2024-01-10', nextAppointment: '2024-02-18' },
    { id: '3', name: 'Mike Brown', email: 'mike@example.com', lastVisit: '2024-01-08', nextAppointment: null },
  ];
  res.json(mockPatients);
});

// Doctor: patients seen (mock)
app.get('/api/doctor/patients-seen', (req, res) => {
  const mockSeen = [
    { id: '1', name: 'John Smith', date: '2024-01-15', reason: 'Follow-up', duration: '15 min' },
    { id: '2', name: 'Sarah Jones', date: '2024-01-10', reason: 'Consultation', duration: '20 min' },
  ];
  res.json(mockSeen);
});

app.post('/payment', async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: "Appointment fees"
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1000 * 100, // Amount in cents
      currency: 'inr'
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: price.id,
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://telemedicine-1-cssc.onrender.com/',
      cancel_url: 'http://localhost:3000/cancel'
    });

    res.json(session);
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});