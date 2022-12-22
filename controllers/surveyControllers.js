const db = require("../dbConnect");

module.exports= {
  getSurveys: async (req, res) => {
    try {
        const allData = await db.query("select * from survey_schema");
        const response = allData.rows;
        // console.log("culia",response)
        res.send(response);
      } catch (e) {
        res.send("an error ocurred");
      }
  },
  getSurveyById: async (req, res) => {
    const {id} = req.params
    try {
        const allData = await db.query("select * from survey_schema where id = $1", [id]);
        const response = allData.rows;
        res.send(response);
      } catch (e) {
        res.send("an error ocurred");
      }
  },
  createSurvey: async (req,res)=>{
    console.log(req.body)
    const {id,name, content, createdAt, createdBy} = req.body
    const createQuery = "INSERT INTO survey_schema (id,name,content, createdAt, createdBy) VALUES ($1, $2, $3, $4, $5) RETURNING *;"
    try {
        const allData = await db.query("select * from survey_schema where name = $1",[name]);
        const counts = allData.rows.count;
        if (counts > 0) {throw new Error("Schema already exists with this name")}
        const values = [id, name, content, new Date(createdAt), createdBy]
        console.log(values)
        const response = await db.query(createQuery, values)
        console.log(response)
        res.send(response);
      } catch (e) {
        res.status(400).send("an error ocurred");
      }
},
deleteSurvey: async (req, res) => {
  const {id} = req.params
  console.log("deleting", id)
  try {
      const response = await db.query("DELETE FROM survey_schema WHERE id = $1;", [id]);
      console.log(response)
      if (response.rowCount > 0) {
        return res.status(200).send({message: `Survey ${response[0].name} with id: ${response[0].id} was deleted`});
      } else {
        return res.status(400).send('Was not possible to delete survey')
      }
    } catch (e) {
      return res.status(500).send("an error ocurred");
    }
},
}