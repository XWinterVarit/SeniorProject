var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Welcome Junior');
});
router.post('/sendtest', (req, res, next) => {

        if (req.body.input === "good") {
            res.json({message: "very good"})
        } else {
            res.end()
        }
})
module.exports = router;
