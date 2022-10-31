var mysql = require('mysql');
const axios = require('axios')

const apiKey = '91c7146403c1d00c68201b0d5572c322'
const sportKey = 'upcoming'
const regions = 'us' 
const markets = 'h2h'
const oddsFormat = 'decimal'
const dateFormat = 'iso' 

var teams = [
  {id: 1, name: 'Golden State Warriors'},
  {id: 2, name: 'Los Angeles Lakers'},
  {id: 5, name: 'Philadelphia 76ers'},
  {id: 7, name: 'Boston Celtics'},
  {id: 12, name: 'Brooklyn Nets'},
  {id: 13 ,name: 'Los Angeles Clippers'},
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
  con.connect(function(err) { 
    if (err) throw err;
    console.log("Connected!");
  
    for(let i = 0; i < response.data.length; i++){
      team1_id = teams.find(item => item.name === response.data[i].home_team)
      team2_id = teams.find(item => item.name === response.data[i].away_team)
      start_date = response.data[i].commence_time
      id = response.data[i].id
  
      let date = new Date(start_date)
      let date_certo = new Date(start_date)
      let tomorrow = new Date();
      date_certo.setTime(date_certo.getTime() - 10*60000)
      tomorrow.setDate(date.getDate()+1)
      date.setHours(-3,0,0,0)
      tomorrow.setHours(-3,0,0,0)
      date_certo = date_certo.toString().split('G')[0]

      console.log(tomorrow.toISOString())
      console.log(id)

      let odd_time_1 = response.data[i].bookmakers[0].markets[0].outcomes[0].price
      let odd_time_2 = response.data[i].bookmakers[0].markets[0].outcomes[1].price

      var sql = "INSERT INTO game_matches (id, category_id, tournament_id, team1_id, team2_id, name, start_date, end_date, status, is_unlock) VALUES (id, 1, 2, "+ team1_id.id +", "+ team2_id.id +", '"+ team1_id.name +" VS "+ team2_id.name +" / "+ date_certo +"', '"+ date.toISOString() +"', '"+ tomorrow.toISOString() +"', 1, 0)";
      
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

      });

    }

  });
})
