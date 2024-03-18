const { getAllCandidatesQuery } = require("../constants");

async function fetchAllCandidates(pool,) {
  const client = await pool.connect();
  // Execute the SQL query
  const { rows } = await client.query(getAllCandidatesQuery);
  client.release();
  let response={};
  rows.forEach(row => {
    if (!response[row.id]) {
      response[row.id] = row;
      response[row.id].skills = row.skills ? [row.skills] : [];
    }
    else{
      response[row.id]?.skills?.push(row.skills);
    }
  });
  return Object.values(response);
}

module.exports = fetchAllCandidates;
