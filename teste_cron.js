var cron = require('node-cron');
var mysql = require('mysql');
const axios = require('axios')

const apiKey = '57c559f5a638226bc939537952fd7f97'
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

cron.schedule('* * * * *', () => {
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
        console.log("Connected!");
        for(let i = 0; i < response.data.length; i++){
          console.log(response.data[i].bookmakers[0].markets[0].outcomes[0])
        }
    })
});