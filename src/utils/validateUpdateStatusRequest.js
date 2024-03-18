const { validStatus } = require("../constants")

const validatePatchStatus = (req) => {
    const { id } = req.params;
    const { status } = req.body;
    return status && validStatus.includes(status) && id;
}


module.exports = validatePatchStatus;