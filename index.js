var mysql = require('mysql');
const axios = require('axios')
var cron = require('node-cron');

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

var teamsNBA = [
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

function get_nba_matches(){
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
    
        var con = mysql.createConnection({
            host: "162.214.49.127",
            user: "pokermob_better",
            password: "Admlock22#",
            database: "pokermob_bet"
        });
    
      con.connect(function(err) { 
        if (err) throw err;
        console.log("Connected!");
      
        for(let i = 0; i < response.data.length; i++){
          team1_id = teamsNBA.find(item => item.name === response.data[i].home_team)
          team2_id = teamsNBA.find(item => item.name === response.data[i].away_team)
          start_date = response.data[i].commence_time
          id = response.data[i].id
      
          date = new Date(start_date)
          date_certo = new Date(start_date)
          tomorrow = new Date();
          date_certo.setTime(date_certo.getTime() - 10*60000)
          tomorrow.setDate(date.getDate()+1)
          date.setHours(-3,0,0,0)
          tomorrow.setHours(-3,0,0,0)
          date_certo = date_certo.toString().split('G')[0]
    
          let odd_time_1 = response.data[i].bookmakers[0].markets[0].outcomes[0].price
          let odd_time_2 = response.data[i].bookmakers[0].markets[0].outcomes[1].price
          searchResults(team1_id.name + ' VS ' + team2_id.name + ' / ' + date_certo, team1_id, team2_id, start_date, id, date, date_certo, tomorrow,odd_time_1,odd_time_2).then(() => {
            
         });
        }
      });
      console.log('Ciclo terminado')
      con.end()
    })

    async function searchResults(name, team1_id, team2_id, start_date, id, date, date_certo, tomorrow,odd_time_1,odd_time_2){

        var select = mysql.createConnection({
            host: "162.214.49.127",
            user: "pokermob_better",
            password: "Admlock22#",
            database: "pokermob_bet"
          });
    
            var sql = "SELECT * FROM `game_matches` WHERE `name` = '"+ name +"'";
    
            await select.query(sql, function (err, result) {
                if (err) throw err;
                if(result.length == 0){
                    insertMatch(team1_id, team2_id, start_date, id, date, date_certo, tomorrow,odd_time_1,odd_time_2).then(() =>{
                    })
                }else{
                    updateOdds(result[0].id,odd_time_1,odd_time_2)
                }
            })
        select.end()
    }
    
    async function updateOdds(id,odd_time_1,odd_time_2){
        var update = mysql.createConnection({
            host: "162.214.49.127",
            user: "pokermob_better",
            password: "Admlock22#",
            database: "pokermob_bet"
          });
    
          var sql = "SELECT * FROM `game_questions` WHERE `match_id` = "+id+"";
    
          await update.query(sql, async function (err, result) {
            if (err) throw err;
    
            var sql = "SELECT * FROM `game_options` WHERE`question_id` = '"+ result[0].id +"'"
    
            await update.query(sql, async function (err, result) {
                if (err) throw err;
    
                var sql = "UPDATE `game_options` SET `ratio`= '"+odd_time_1+"' WHERE `id` = '"+result[0].id+"'"
                var sql2 = "UPDATE `game_options` SET `ratio`= '"+odd_time_2+"' WHERE `id` = '"+result[1].id+"'"
                
                await update.query(sql, function (err, result) {
                    if (err) throw err;
                })
    
                await update.query(sql2, function (err, result) {
                    if (err) throw err;
                    update.end()
                })
    
            })
    
        })
    }
    
    async function insertMatch(team1_id, team2_id, start_date, id, date, date_certo, tomorrow,odd_time_1,odd_time_2){
    
        var insert = mysql.createConnection({
            host: "162.214.49.127",
            user: "pokermob_better",
            password: "Admlock22#",
            database: "pokermob_bet"
          });
    
          var sql = "INSERT INTO game_matches (id, category_id, tournament_id, team1_id, team2_id, name, start_date, end_date, status, is_unlock) VALUES (id, 1, 2, "+ team1_id.id +", "+ team2_id.id +", '"+ team1_id.name +" VS "+ team2_id.name +" / "+ date_certo +"', '"+ date.toISOString() +"', '"+ tomorrow.toISOString() +"', 1, 0)";
    
            await insert.query(sql, async function (err, result) {
                if (err) throw err;
                let match_id = result.insertId;
    
                var sql = "INSERT INTO game_questions (`match_id`,`result_id`,`name`,`status`,`is_unlock`,`result`,`limit`,`creator_id`,`end_time`) VALUES ("+ match_id +", null, 'Quem Ganha', 1, 0, 0, 100, 1, '"+ tomorrow.toISOString() +"')";
            
                await insert.query(sql, async function (err, result) {
                  if (err) throw err;
                  let question_id = result.insertId;
        
                  var sql = "INSERT INTO `game_options`(`match_id`, `question_id`, `creator_id`, `option_name`, `invest_amount`, `return_amount`, `minimum_amount`, `ratio`, `status`) VALUES ("+ match_id +", "+ question_id +", 1, '"+ team1_id.name +"', 0, 0, 2, "+ odd_time_1 +", 1)";
                  var sql2 = "INSERT INTO `game_options`(`match_id`, `question_id`, `creator_id`, `option_name`, `invest_amount`, `return_amount`, `minimum_amount`, `ratio`, `status`) VALUES ("+ match_id +", "+ question_id +", 1, '"+ team2_id.name +"', 0, 0, 2, "+ odd_time_2 +", 1)";
        
                  await insert.query(sql, function (err, result) {
                    if (err) throw err;
                  })
        
                  await insert.query(sql2, function (err, result) {
                    if (err) throw err;
                    insert.end()
                  })
                  
                  
                })
            })
            
    }

}


cron.schedule('01 18 * * *', () => {get_nba_matches()})