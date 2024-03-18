module.exports.connectionString = "postgres://thchpxcn:DMJ4p7X-0XZ23QWiwWgNL6k2wO1MhCkX@ziggy.db.elephantsql.com/thchpxcn";
module.exports.getAllCandidatesQuery = `SELECT c.id AS id,c.name AS name,c.phone_number,c.email_id,c.expected_salary,c.status,c.score,s.name AS skills FROM candidates c LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id LEFT JOIN skills s ON cs.skill_id = s.id;`;
module.exports.getAllSkillsQuery = `SELECT * FROM skills;`;
module.exports.createCandidateQuery = `INSERT INTO candidates (name, phone_number, email_id, expected_salary,score) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
module.exports.fetchScoreQuery = `SELECT score FROM experience_scores WHERE $1 BETWEEN experience_range_start AND experience_range_end`;
module.exports.insertCandidateSkillQuery = `INSERT INTO candidate_skills (candidate_id, skill_id, experience_years) VALUES ($1, $2, $3) RETURNING *`;
module.exports.updateCandidateStatusQuery = `UPDATE candidates SET status=$1 WHERE id=$2 RETURNING *`;
module.exports.validStatus = ["contacted","interview scheduled","offer extended", "rejected", "hired"];