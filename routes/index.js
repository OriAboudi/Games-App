const express= require("express");
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"Api Work 200 11:57"});
})


module.exports = router;