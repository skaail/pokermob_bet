var mysql = require('mysql');
var mysql = require('mysql');
const axios = require('axios')

const apiKey = '57c559f5a638226bc939537952fd7f97'
const sportKey = 'upcoming'
const regions = 'us' 
const markets = 'h2h'
const oddsFormat = 'decimal'
const dateFormat = 'iso' 

var teams = [
  {id: 4, name: 'Flamengo'},
  {id: 3, name: 'Corinthians'},
  {id: 89, name: 'Palmeiras'},
  {id: 90, name: 'Internacional'},
  {id: 91, name: 'Fluminense'},
  {id: 92 ,name: 'Atletico Paranaense'},
  {id: 93, name: 'Fortaleza'},
  {id: 94, name: 'Atletico Mineiro'},
  {id: 95, name: 'Sao Paulo'},
  {id: 96, name: 'Botafogo'},
  {id: 97, name: 'América Mineiro'},
  {id: 98, name: 'Santos'},
  {id: 99, name: 'Goiás'},
  {id: 100, name: 'Bragantino-SP'},
  {id: 101, name: 'Coritiba'},
  {id: 102, name: 'Ceará'},
  {id: 103, name: 'Atletico Goianiense'},
  {id: 104, name: 'Cuiabá'},
  {id: 105, name: 'Avai'},
  {id: 106, name: 'Juventude'}
]



var con = mysql.createConnection({
  host: "162.214.49.127",
  user: "pokermob_better",
  password: "Admlock22#",
  database: "pokermob_bet"
});

axios.get(`https://api.the-odds-api.com/v4/sports/soccer_brazil_campeonato/odds`, {
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

        var sql = "INSERT INTO game_matches (id, category_id, tournament_id, team1_id, team2_id, name, start_date, end_date, status, is_unlock) VALUES (id, 1, 16, "+ team1_id.id +", "+ team2_id.id +", '"+ team1_id.name +" VS "+ team2_id.name +" / "+ date_certo +"', '"+ date.toISOString() +"', '"+ tomorrow.toISOString() +"', 1, 0)";

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