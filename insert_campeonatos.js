var mysql = require('mysql');
var mysql = require('mysql');
const axios = require('axios')

const apiKey = '91c7146403c1d00c68201b0d5572c322'
const sportKey = 'upcoming'
const regions = 'us' 
const markets = 'h2h'
const oddsFormat = 'decimal'
const dateFormat = 'iso' 

var con = mysql.createConnection({
  host: "162.214.49.127",
  user: "pokermob_better",
  password: "Admlock22#",
  database: "pokermob_bet"
});

axios.get('https://api.the-odds-api.com/v4/sports/', {
    params: {
        apiKey
    }
})
.then(response => {
  con.connect(function(err) { 
    if (err) throw err;
    console.log("Connected!");
    
    for(let i = 0; i < response.data.length; i++){
      if(response.data[i].group == 'Soccer'){
        var sql = "INSERT INTO game_tournaments (category_id, name, status, created_at, updated_at) VALUES (2, '"+ response.data[i].title +"', 1, '2022-10-20 01:40:23', '2022-10-20 01:40:23')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      }
      console.log(response.data[i].title);
    }
    
  });

})