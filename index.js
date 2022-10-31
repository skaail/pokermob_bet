const axios = require('axios')
const { format } = require('mysql')

// An api key is emailed to you when you sign up to a plan
// Get a free API key at https://api.the-odds-api.com/
const apiKey = '57c559f5a638226bc939537952fd7f97'

const sportKey = 'basketball_nba' // use the sport_key from the /sports endpoint below, or use 'upcoming' to see the next 8 games across all sports

const regions = 'us' // uk | us | eu | au. Multiple can be specified if comma delimited

const markets = 'h2h' // h2h | spreads | totals. Multiple can be specified if comma delimited

const oddsFormat = 'decimal' // decimal | american

const dateFormat = 'iso' // iso | unix

/*
    First get a list of in-season sports
        the sport 'key' from the response can be used to get odds in the next request

*/


/*
    Now get a list of live & upcoming games for the sport you want, along with odds for different bookmakers
    This will deduct from the usage quota
    The usage quota cost = [number of markets specified] x [number of regions specified]
    For examples of usage quota costs, see https://the-odds-api.com/liveapi/guides/v4/#usage-quota-costs

*/
axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
    params: {
        apiKey,
        regions,
        markets,
        oddsFormat,
        dateFormat,
    }
})
.then(response => {
    // response.data.data contains a list of live and 
    //   upcoming events and odds for different bookmakers.
    // Events are ordered by start time (live events are first)
    for (let i = 0; i < response.data.length; i++) {
      console.log(JSON.stringify(response.data[i].home_team) + ' VS ' + JSON.stringify(response.data[i].away_team))
      
    }
    

    // Check your usage
    console.log('Remaining requests',response.headers['x-requests-remaining'])
    console.log('Used requests',response.headers['x-requests-used'])

})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})