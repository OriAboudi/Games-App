const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateJoi } = require("../models/gamesAppModel");
const { GamesAppsModel } = require("../models/gamesAppModel");
const lodash = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 8;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let cat = req.query.cat;
  let userId = req.query.id
  let search = req.query.search;
  try {
    let findQuery = {}
    if (cat) {
      findQuery = {
        category_url: cat
      }
    }
    else if (userId) {
      findQuery = { user_id: userId }
    }
    else if (search) {
      let searchExp = new RegExp(search, 'i');
      findQuery = { $or: [{ name: searchExp }, { info: searchExp }] }
    }
 
    let data = await GamesAppsModel
      .find(findQuery)
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get("/single/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let data = await GamesAppsModel.findOne({ _id: id })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})



router.get("/count", async (req, res) => {
  let perPage = Number(req.query.perPage) || 5;
  let cat = req.query.cat;
  let userId = req.query.id
  try {
    let findQuery = {};
    if (cat) {
      findQuery = { category_url: cat }
    }
    else if (userId) {
      findQuery = { user_id: userId }
    }

    let count = await GamesAppsModel.countDocuments(findQuery);
    let pages = Math.ceil(count / perPage);
    res.json({ count, pages })

  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


router.post('/', auth, async (req, res) => {
  let validBody = validateJoi(req.body)
  if (validBody.error) {
    res.status(401).json(validBody.error.details)
  }
  try {
    let gameApp = new GamesAppsModel(req.body)
    gameApp.user_id = req.tokenData._id;
    gameApp.short_id = await createShortId()
    //TODO: short id: 
    await gameApp.save()
    res.status(200).json(gameApp);

  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", auth, async (req, res) => {
  let validBody = validateJoi(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    if (req.tokenData.role == "admin") {
      data = await GamesAppsModel.updateOne({ _id: id }, req.body)
    }
    else {
      data = await GamesAppsModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body)
    }

    // modfiedCount : 1 - אם הצליח לערוך נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
router.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let data;
    if (req.tokenData.role == "admin") {
      data = await GamesAppsModel.deleteOne({ _id: id })
    }
    else {
      data = await GamesAppsModel.deleteOne({ _id: id, user_id: req.tokenData._id });
    }

    // deletedCount : 1 - אם הצליח לערוך נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.post('/group', async (req, res) => {
  try {
    let data = await GamesAppsModel.find({ "_id": { $in: req.body.ids } })
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})
const createShortId = async () => {

  try {

    while (true) {
      let rand = lodash.random(0, 9999)
      game = await GamesAppsModel.findOne({ short_id: rand });
      if (!game) { return rand }
    }

  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
}
module.exports = router; 