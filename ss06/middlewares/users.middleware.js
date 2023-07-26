module.exports.validateBody = (req, res, next) => {
  console.log(req.body);

  let { email, password } = req.body;

  if (!email || !password) {
    res.json({ status: "fail", message: "email and password are invalid" });
  } else {
    console.log("success");
    next();
  }
};

exports.findUser = (req, res, next) => {
  let id = req.params.id;
  id ? next() : res.json({ message: "not found" });
};
