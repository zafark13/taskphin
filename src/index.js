const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const { connectionString, getAllCandidatesQuery, getAllSkillsQuery, validStatus, createCandidateQuery, updateCandidateStatusQuery } = require('./constants');
const fetchAllCandidates = require('./component/getAllCandidates');
const createCandidates = require('./component/createCandidate');
const validateCreateCandidate  = require('./utils/validateCreateCandidateRequest');
const validatePatchStatus = require('./utils/validateUpdateStatusRequest');

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/candidates', async (req, res) => {
  try {
    let response=await fetchAllCandidates(pool);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all skills
app.get('/skills', async (req, res) => {
  try {
    const { rows } = await pool.query(getAllSkillsQuery);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create a new candidate
app.post('/candidates', async (req, res) => {
  if (!validateCreateCandidate(req)){
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }
  try {
    let response=await createCandidates(pool,req);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/candidates/:id', async (req, res) => {
  if (!validatePatchStatus(req)){
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await pool.query(updateCandidateStatusQuery,[status, id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Candidate not found' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});