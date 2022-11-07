var mysql = require('mysql');
var mysql = require('mysql');
const axios = require('axios')

const apiKey = '697769dd74e45fcf08683cdd04299d8e'
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

axios.get('https://api.the-odds-api.com/v4/sports/basketball_nba/scores/?daysFrom=1', {
    params: {
        apiKey,
        regions,
        markets,
        oddsFormat,
        dateFormat,
    }
})
.then(response => {
  con.connect(function(err) { 
    api_result = response.data
    if (err) throw err;
    console.log("Connected!");
    for(let i = 0; i < api_result.length; i++) {

        try {
            team1 = api_result[i].scores[0].name
            team2 = api_result[i].scores[1].name

            team1_points = parseInt(api_result[i].scores[0].score)
            team2_points = parseInt(api_result[i].scores[1].score)

            if (err) throw err;

            if(team1_points > team2_points){
                var sql = "UPDATE game_options SET status = 2 WHERE option_name = '" + team1 + "'";
            }else{
                var sql = "UPDATE game_options SET status = -2 WHERE option_name = '" + team2 + "'";
            }
            
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result.affectedRows + " record(s) updated");
            });

        } catch (error) {
            console.log('a partida não terminou')
        }
    }
    
  });

})