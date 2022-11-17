var mysql = require('mysql');
var mysql = require('mysql');
const axios = require('axios')

var teams = [
    {id: 1, name: 'Golden State Warriors'},
    {id: 2, name: 'Los Angeles Lakers'},
    {id: 5, name: 'Philadelphia 76ers'},
    {id: 7, name: 'Boston Celtics'},
    {id: 12, name: 'Brooklyn Nets'},
    {id: 13 ,name: 'LA Clippers'},
    {id: 14, name: 'New York Knicks'},
    {id: 15, name: 'Phoenix Suns'},
    {id: 16, name: 'Toronto Raptors'},
    {id: 17, name: 'Sacramento Kings'},
    {id: 18, name: 'Chicago Bulls'},
    {id: 19, name: 'Atlanta Hawks'},
    {id: 20, name: 'Cleveland Cavaliers'},
    {id: 21, name: 'Charlotte Hornets'},
    {id: 22, name: 'Detroit Pistons'},
    {id: 23, name: 'Miami Heat'},
    {id: 24, name: 'Indiana Pacers'},
    {id: 25, name: 'Orlando Magic'},
    {id: 26, name: 'Milwaukee Bucks'},
    {id: 27, name: 'Washington Wizards'},
    {id: 28, name: 'Denver Nuggets'},
    {id: 29, name: 'Dallas Mavericks'},
    {id: 30, name: 'Minnesota Timberwolves'},
    {id: 31, name: 'Houston Rockets'},
    {id: 32, name: 'Oklahoma City Thunder'},
    {id: 33, name: 'Memphis Grizzlies'},
    {id: 34, name: 'Portland Trail Blazers'},
    {id: 35, name: 'New Orleans Pelicans'},
    {id: 36, name: 'Utah Jazz'},
    {id: 37, name: 'San Antonio Spurs'}
]
require('dotenv').config();

const apiKey = process.env.apiKey
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

axios.get(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds`, {
    params: {
        apiKey,
        regions,
        markets,
        oddsFormat,
        dateFormat,
    }
})
.then(response => {
  console.log(response)
  api_result = response

  for (let i = 0; i < api_result.length; i++) {

    team1_id = teams.find(item => item.name === api_result[i].home_team)
    team2_id = teams.find(item => item.name === api_result[i].away_team)
    start_date = api_result[i].commence_time

    let date = new Date(start_date)
    let tomorrow = new Date();
    tomorrow.setDate(date.getDate()+1)
    date.setHours(-3,0,0,0)
    tomorrow.setHours(-3,0,0,0)
    
    console.log(date.toISOString())
    console.log(tomorrow.toISOString())
    
    var sql = "INSERT INTO game_matches (category_id, tournament_id, team1_id, team2_id, name, start_date, end_date, status, is_unlock) VALUES (1, 2, "+ team1_id.id +", "+ team2_id.id +", '"+ team1_id.name +" VS "+ team2_id.name +" / "+ date +"', '"+ date.toISOString() +"', '"+ tomorrow.toISOString() +"', 1, 0)";
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });

}
})