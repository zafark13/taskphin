const { validStatus } = require("../constants")
const validateCreateCandidate = (req) => {
    const { name, phone_number, email_id, expected_salary, skills } = req.body;
    return name && phone_number && email_id && expected_salary && skills;
}

module.exports = validateCreateCandidate;