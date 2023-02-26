
// const express= require("express");
// const router = express.Router();
// require("dotenv").config()
// const cloudinary = require("cloudinary").v2




// router.get("/", async(req,res) => {
//   res.json({msg:"Api Work 200 09:20"});
// })




// router.get("/get-signature", (req, res) => {
//   const cloud_name="dzchbifhx"
//   const api_key= "784936575215999"
//   const  api_secret = "2QGBmU0ixE8piFKoVOW0EiE6OVQ"


//   const timestamp = Math.round(new Date().getTime() / 1000)
//   const signature = cloudinary.utils.api_sign_request(
//     {
//       timestamp: timestamp
//     },
//     api_secret
//   )
//   res.json({ timestamp, signature })
// })

// router.post("/do-something-with-photo", async (req, res) => {
//   const  api_secret = "2QGBmU0ixE8piFKoVOW0EiE6OVQ"

//   const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version },api_secret)

//   if (expectedSignature === req.body.signature) {

//     await fse.ensureFile("./data.txt")
//     const existingData = await fse.readFile("./data.txt", "utf8")
//     await fse.outputFile("./data.txt", existingData + req.body.public_id + "\n")
//   }
// })


// module.exports = router;


const express = require("express");
const { GamesAppsModel } = require("../models/gamesAppModel");
const router = express.Router();

router.get("/", async (req, res) => {
  let data = await GamesAppsModel.findById("63d63d1f9c24af0653e37a4b")

  res.json(data);
})

router.post('/upload', async (req, res) => {
  let image = req.body.img;
console.log(image);

  try {
    let data = await GamesAppsModel.updateOne({ _id: "63d63d1f9c24af0653e37a4b" }, { img_url: image })
    res.status(200).json({ msg: "image updated successfully in cloudinary", data })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }

})



module.exports = router;