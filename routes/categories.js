const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const lodash = require("lodash");
let { CategoryModel, validateJoi } = require("../models/categoryModel");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let data = await CategoryModel.find({})
            .limit(20);
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/single/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let data = await CategoryModel.findOne({ _id: id })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

//שולף קטגוריה לפי השם שלה
router.get("/byCode/:url_code", async (req, res) => {
    try {
        let url_code = req.params.url_code;
        let data = await CategoryModel.findOne({ url_code });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.post('/', authAdmin, async (req, res) => {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        res.status(401).json(validBody.error.details)
    }
    try {
        let category = new CategoryModel(req.body)
        category.short_id = await createShortId();
        await category.save()
        res.status(201).json(category);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.put('/:id', authAdmin, async (req, res) => {
    let idUpdate = req.params.id;
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        res.status(401).json(validBody.error.details)

    }
    try {
        let data = await CategoryModel.updateOne({ _id: idUpdate }, req.body)
        res.status(200).json(data);

    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.delete('/:id', authAdmin, async (req, res) => {
    let idDel = req.params.id;
    try {
        let data = await CategoryModel.deleteOne({ _id: idDel })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
const createSohrtId = async () => {
    while (true) {
        let rand = lodash.random(0.9999)
        let category = await CategoryModel.findOne({ short_id: rand })
        if (!category) return rand;
    }
}

module.exports = router;


