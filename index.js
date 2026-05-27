require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Rate Limiting (Prevent DDoS/Brute-force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use('/api', limiter);

// 3. CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Payload Size Limit
app.use(express.json({ limit: '10kb' })); 

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ayushmehrotraisthedev:ayushmehrotraisthedev@cluster0.luggmsv.mongodb.net/wealthfinopolicy";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schemas
const ComplaintSchema = new mongoose.Schema({
  monthEnding: String,
  currentMonth: [{ id: Number, receivedFrom: String, pendingLastMonth: Number, received: Number, resolved: Number, totalPending: Number }],
  monthlyTrend: [{ id: Number, month: String, carriedForward: Number, received: Number, resolved: Number, pending: Number }],
  annualTrend: [{ id: Number, year: String, carriedForward: Number, received: Number, resolved: Number, pending: Number }]
});

const ClientConsentSchema = new mongoose.Schema({
  headerText: String,
  sections: [{ title: String, content: String }]
});

// Models
const Complaint = mongoose.model('Complaint', ComplaintSchema);
const ClientConsent = mongoose.model('ClientConsent', ClientConsentSchema);

// Initial Data Seeding
const seedDatabase = async () => {
  try {
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      console.log("Seeding Complaints Data...");
      await Complaint.create({
        monthEnding: "May 2026",
        currentMonth: [
          { id: 1, receivedFrom: "Directly from Investors", pendingLastMonth: 0, received: 0, resolved: 0, totalPending: 0 },
          { id: 2, receivedFrom: "SEBI (SCORES)", pendingLastMonth: 0, received: 0, resolved: 0, totalPending: 0 },
          { id: 3, receivedFrom: "Other Sources (if any)", pendingLastMonth: 0, received: 0, resolved: 0, totalPending: 0 }
        ],
        monthlyTrend: [
          { id: 1, month: "Sep 25", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 2, month: "Oct 25", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 3, month: "Nov 25", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 4, month: "Dec 25", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 5, month: "Jan 26", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 6, month: "Feb 26", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 7, month: "Mar 26", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 8, month: "Apr 26", carriedForward: 0, received: 0, resolved: 0, pending: 0 }
        ],
        annualTrend: [
          { id: 1, year: "2022–2023", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 2, year: "2023–2024", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 3, year: "2024–2025", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 4, year: "2025–2026", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
          { id: 5, year: "2026–2027", carriedForward: 0, received: 0, resolved: 0, pending: 0 }
        ]
      });
    }

    const consentCount = await ClientConsent.countDocuments();
    if (consentCount === 0) {
      console.log("Seeding Client Consent Data...");
      await ClientConsent.create({
        headerText: "Research Recommendation Services are provided by Mr. Krishna Kumar Pathak, a SEBI-Registered Research Analyst (Registration No. INH300009914, BSE Enlistment No. 5590), in full compliance with the SEBI (Research Analyst) Regulations, 2014.",
        sections: [
          {
            title: "1. Acceptance of MITC & Terms and Conditions :",
            content: "<p>I, the Client/User confirm that I have read and understood the Most Important Terms & Conditions (MITC) and Terms & Conditions of Mr. Krishna Kumar Pathak, SEBI-Registered Research Analyst (Reg. No. INH300009914). I voluntarily accept these terms and agree they are legally binding. I understand they govern the research recommendation services provided to me under SEBI regulations. I agree to comply with all obligations and accept that I am solely responsible for my actions based on the research recommendations received.</p>"
          },
          {
            title: "2. Digital Consent, KYC & Electronic Signature Declaration :",
            content: "<p>I, the Client/User, hereby provide my explicit and informed consent to Mr. Krishna Kumar Pathak, SEBI-Registered Research Analyst ( Reg. No. INH300009914), by verifying my identity through the One-Time Password (OTP) sent to my registered mobile number or Aadhaar-linked mobile number and affixing my electronic/digital signature (finger-drawn, stylus, or signature capture) on the mobile application, website, tablet interface, or any other authorized digital platform. I authorize the collection, processing, and verification of my KYC details, including but not limited to PAN, Aadhaar (via UIDAI/ DigiLocker), name, date of birth, address, registered mobile number, and email ID, and consent to verification through NSE KRA, CVL KRA, NDML KRA, Karvy/KFintech KRA, DotEx KRA, or any SEBI-registered/authorized and third party APIs service provider. For regulatory, security, and audit purposes, I consent to the capture and secure storage of my IP address, timestamp, device type/details, OTP verification records, and electronic/digital signature, which shall form part of the legal record of this authorization. This consent constitutes a legally valid, binding, and enforceable electronic agreement under the Indian Contract Act, 1872, Section 10A of the Information Technology Act, 2000, and is compliant with the Digital Personal Data Protection (DPDP) Act, 2023, remaining effective until expressly revoked in writing</p>"
          },
          {
            title: "3. Disclaimer & Risk Warning :",
            content: "<p>Investment in securities market are subject to market risks. Read all the related documents carefully before investing. \"Registration granted by SEBI & Certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to Investors. Options trading is highly risky and may result in significant losses. No Guarantee of Returns. Liability & Legal Indemnity: By accessing our research services, Clients/Users acknowledge and agree that Mr. Krishna Kumar Pathak, SEBI-Registered Research Analyst (RA Reg. No. INH300009914, BSE Enlistment No. 5590), acts solely as a research service provider and shall not be liable for any direct, indirect, incidental, or consequential loss, damage, or financial outcome arising from investment decisions taken based on the research recommendations provided</p>"
          }
        ]
      });
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

seedDatabase();

// API Endpoints
// API Endpoints for Complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const data = await Complaint.findOne();
    if (!data) return res.status(404).json({ message: "No data found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    // We only want one document to exist, so we either create or overwrite
    await Complaint.deleteMany({});
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/complaints', async (req, res) => {
  try {
    const updated = await Complaint.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/complaints', async (req, res) => {
  try {
    await Complaint.deleteMany({});
    res.json({ message: "Complaints data cleared." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Endpoints for Client Consent
app.get('/api/client-consent', async (req, res) => {
  try {
    const data = await ClientConsent.findOne();
    if (!data) return res.status(404).json({ message: "No data found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/client-consent', async (req, res) => {
  try {
    await ClientConsent.deleteMany({});
    const newConsent = new ClientConsent(req.body);
    await newConsent.save();
    res.status(201).json(newConsent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/client-consent', async (req, res) => {
  try {
    const updated = await ClientConsent.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/client-consent', async (req, res) => {
  try {
    await ClientConsent.deleteMany({});
    res.json({ message: "Client consent data cleared." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root endpoint for Vercel health check
app.get('/', (req, res) => {
  res.send('WealthFino Policy API is running securely.');
});

// Export the app for Vercel serverless function
module.exports = app;

// Only listen locally if not in Vercel production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
}
