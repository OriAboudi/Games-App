const indexR = require("./index");
const usersR = require("./users");
const categoriesR = require("./categories");
const gamesAppR = require("./gamesApp");
const uploadR = require("./upload");
const cloudinryR = require("./cloudinry");


exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/categories",categoriesR);
  app.use("/gamesApp",gamesAppR);
  app.use("/upload",uploadR);
  app.use("/cloudinary",cloudinryR);


// כל ראוט אחר שנגיע שלא קיים בתקיית פאליק או כראוט
// נקבל 404
  app.use("*",(req,res) => {
    res.status(404).json({msg:"endpoint not found , 404",error:404})
  })
}