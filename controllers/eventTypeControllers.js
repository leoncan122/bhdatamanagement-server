const db = require("../dbConnect");

module.exports= {
    getEventType: async (req,res)=>{
    try {
        const allData = await db.query("select * from event_type");
        const response = allData.rows;
        res.send(response);
      } catch (e) {
        res.send("an error ocurred");
      }
}
}