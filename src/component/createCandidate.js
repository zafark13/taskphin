const { createCandidateQuery, fetchScoreQuery, insertCandidateSkillQuery } = require("../constants");

async function createCandidates(pool,req) {
  try{
    const { name, phone_number, email_id, expected_salary, skills } = req.body;
    const client = await pool.connect();
    await client.query('BEGIN'); // Start the transaction
    let score = await calculateScore(pool,skills);
    const { rows } = await pool.query(
      createCandidateQuery,
      [name, phone_number, email_id, expected_salary,score]
    );
    skills.forEach(element => {
      insertCandidateSkill(pool,rows[0].id, element.id, element.experience);
    });
    await client.query('COMMIT'); // Commit the transaction
    rows[0].skills = skills;
    return rows[0];
  }
  catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of error
    client.release();
    throw error;
  }
}

const calculateScore = async(pool,skills) => {
    let score = 0;
    for (let i = 0; i < skills.length; i++) {
      const { rows } = await pool.query(fetchScoreQuery, [skills[i].experience]);
      score += rows[0].score;
    }
    return score;
  }
  
  // Function to insert data into candidate_skills table
  const insertCandidateSkill = async (pool,candidateId, skillId, experienceYears) => {
    try {
      const { rows } = await pool.query(insertCandidateSkillQuery, [candidateId, skillId, experienceYears]);
      return rows; // Return the inserted row
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error; // Rethrow the error to handle it at the caller level if necessary
    }
  };

module.exports = createCandidates;