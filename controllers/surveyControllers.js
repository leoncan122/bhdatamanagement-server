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
addSurveyResult: async(req, res) => {
  console.log(req.body)
  const {surveyId, content, createdAt, createdBy} = req.body
  const createQuery = "INSERT INTO survey_result (survey_id, content, createdAt, createdBy) VALUES ($1, $2, $3, $4) RETURNING *"
  try {
      const values = [surveyId, content, new Date(createdAt), createdBy]
      console.log("query values", values)
      const response = await db.query(createQuery, values)
      console.log("response",response)
      res.send(response);
    } catch (e) {
      res.status(400).send("an error ocurred");
    }
},
getSurveyResultById: async (req, res) => {
  const {id} = req.params
  try {
      const allData = await db.query("select * from survey_result where id = $1", [id]);
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
},
getResultBySurveyId: async (req, res) => {
  const {id} = req.params
  try {
      const allData = await db.query("select sr.content as result, sr.createdat as resultdate, sr.createdby as resultby, * from survey_result sr left join survey_schema ss on sr.survey_id = ss.id where ss.id = $1", [id]);
      const response = allData.rows;
      console.log(response)
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
},

//Hace el update pero da siempre error 500
updateSurvey: async (req, res) => {
  // const {id} = req.params
  const {id, content, changedBy, changedAt}  = req.body 
  try {
      const response = await db.query("UPDATE survey_schema set content=$2, changedby=$3, changedat=$4 WHERE id=$1 RETURNING *", [id, content, changedBy, new Date(changedAt)]);
      console.log(response)
      res.status(200).send({message: `Survey ${response[0].name} with id: ${response[0].id} was updated`});
      
    } catch (e) {
      res.status(500).send("an error ocurred");
    }
},
deleteSurvey: async (req, res) => {
  const {id} = req.params
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

createSecondarySurveySchema: async (req,res)=>{
  console.log(req.body)
  const {survey_id, content, createdAt, createdBy} = req.body
  const createQuery = "INSERT INTO related_survey_schema ( survey_id,content, createdAt, createdBy) VALUES ($1, $2, $3, $4) RETURNING *;"
  try {
      // const allData = await db.query("select * from survey_schema where  = $1",[id]);
      // const counts = allData.rows.count;
      // if (counts < 0) {throw new Error("Schema does not exists")}
      const values = [survey_id, content, new Date(createdAt), createdBy]
      console.log(values)
      const response = await db.query(createQuery, values)
      console.log(response)
      res.send(response);
    } catch (e) {
      res.status(400).send("an error ocurred");
    }
},
//Endpoint to update: secondary survey schema need to update relation with survey result when post  
getAllRelatedSurveysBySurveyId: async (req, res) => {
  const {id} = req.params
  try {
      const allData = await db.query("select * from related_survey_schema rss where rss.survey_id = $1", [id]);
      const response = allData.rows;
      console.log(response)
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
},
getRelatedSurveyById: async (req, res) => {
  const {id} = req.params
  try {
      const allData = await db.query("select * from related_survey_schema rss where rss.id = $1", [id]);
      const response = allData.rows;
      console.log(response)
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
},
}