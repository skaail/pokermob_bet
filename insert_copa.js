var mysql = require('mysql');
var mysql = require('mysql');
const axios = require('axios')

const apiKey = '3bccb90224f97e4fe3de74573fe03f84'
const sportKey = 'upcoming'
const regions = 'us' 
const markets = 'h2h'
const oddsFormat = 'decimal'
const dateFormat = 'iso' 

var teams = [
  {id: 10, name: 'Ecuador'},
  {id: 11, name: 'Qatar'},
  {id: 38, name: 'Senegal'},
  {id: 39, name: 'Netherlands'},
  {id: 40, name: 'England'},
  {id: 41, name: 'Iran'},
  {id: 42, name: 'USA'},
  {id: 43, name: 'Wales'},
  {id: 44, name: 'Argentina'},
  {id: 45, name: 'Saudi Arabia'},
  {id: 46, name: 'Mexico'},
  {id: 47, name: 'Poland'},
  {id: 48, name: 'France'},
  {id: 49, name: 'Australia'},
  {id: 50, name: 'Denmark'},
  {id: 51, name: 'Tunisia'},
  {id: 52, name: 'Spain'},
  {id: 53, name: 'Costa Rica'},
  {id: 54, name: 'Germany'},
  {id: 55, name: 'Japan'},
  {id: 56, name: 'Belgium'},
  {id: 57, name: 'Canada'},
  {id: 58, name: 'Morocco'},
  {id: 59, name: 'Croatia'},
  {id: 60, name: 'Brazil'},
  {id: 61, name: 'Serbia'},
  {id: 62, name: 'Switzerland'},
  {id: 63, name: 'Cameroon'},
  {id: 64, name: 'Portugal'},
  {id: 65, name: 'Ghana'},
  {id: 66, name: 'Uruguay'},
  {id: 67, name: 'South Korea'},

]



var con = mysql.createConnection({
  host: "162.214.49.127",
  user: "pokermob_better",
  password: "Admlock22#",
  database: "pokermob_bet"
});

axios.get(`https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds`, {
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
    if (err) throw err;
    console.log("Connected!");
  
    for(let i = 0; i < response.data.length; i++){
        team1_id = teams.find(item => item.name === response.data[i].home_team)
        team2_id = teams.find(item => item.name === response.data[i].away_team)
        console.log(team1_id)
        let start_date = response.data[i].commence_time

        let date = new Date(start_date)
        let date_certo = new Date(start_date)
        let tomorrow = new Date();
        date_certo.setTime(date_certo.getTime() - 10*60000)
        tomorrow.setDate(date.getDate()+1)
        date.setHours(-3,0,0,0)
        tomorrow.setHours(-3,0,0,0)
        date_certo = date_certo.toString().split('G')[0]
  
        console.log(tomorrow.toISOString())

        let odd_time_1 = response.data[i].bookmakers[0].markets[0].outcomes[0].price
        let odd_time_2 = response.data[i].bookmakers[0].markets[0].outcomes[1].price

        var sql = "INSERT INTO game_matches (id, category_id, tournament_id, team1_id, team2_id, name, start_date, end_date, status, is_unlock) VALUES (id, 2, 1, "+ team1_id.id +", "+ team2_id.id +", '"+ team1_id.name +" VS "+ team2_id.name +" / "+ date_certo +"', '"+ date.toISOString() +"', '"+ tomorrow.toISOString() +"', 1, 0)";

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Partida gravada");
            console.log(result.insertId)
            let match_id = result.insertId;
    
            var sql = "INSERT INTO game_questions (`match_id`,`result_id`,`name`,`status`,`is_unlock`,`result`,`limit`,`creator_id`,`end_time`) VALUES ("+ match_id +", null, 'Quem Ganha', 1, 0, 0, 100, 1, '"+ tomorrow.toISOString() +"')";
            
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Pergunta gravada");
              let question_id = result.insertId;
    
              var sql = "INSERT INTO `game_options`(`match_id`, `question_id`, `creator_id`, `option_name`, `invest_amount`, `return_amount`, `minimum_amount`, `ratio`, `status`) VALUES ("+ match_id +", "+ question_id +", 1, '"+ team1_id.name +"', 0, 0, 2, "+ odd_time_1 +", 1)";
              var sql2 = "INSERT INTO `game_options`(`match_id`, `question_id`, `creator_id`, `option_name`, `invest_amount`, `return_amount`, `minimum_amount`, `ratio`, `status`) VALUES ("+ match_id +", "+ question_id +", 1, '"+ team2_id.name +"', 0, 0, 2, "+ odd_time_2 +", 1)";
    
              con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Odd 1 gravada");
              })
    
              con.query(sql2, function (err, result) {
                if (err) throw err;
                console.log("Odd 2 gravada");
              })
    
            })
    
          })

        
    }
    
  });

})




