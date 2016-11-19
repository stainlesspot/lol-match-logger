'use strict';

var google = require('googleapis');
var googleAuth = require('google-auth-library');
var spreadsheetId = '1bgMjPHS-3hqKeuburfRNMFpv-k-QvVmZ3gG-ARakPvs';

var authFactory = new googleAuth();

authFactory.getApplicationDefault(function(err, authClient) {
	if (err) {
		console.log('Authentication failed because of ', err);
		return;
	}
	if (authClient.createScopedRequired && authClient.createScopedRequired()) {
		authClient = authClient.createScoped(['https://www.googleapis.com/auth/spreadsheets']);
	}


	var googleSheets = google.sheets({version: 'v4', auth: authClient}).spreadsheets;

/*	googleSheets.get({spreadsheetId: spreadsheetId},function (err, response){
		if (err) {
           	console.log(err);
           	return;
       	}
		for(let sheet of response.sheets){
			if(sheet.properties.title === 'Chart'){
				googleSheets.batchUpdate(
					{
						spreadsheetId: spreadsheetId,
						resource: {
				      		requests: [{
				      			updateCells: {
								    start: {
									    sheetId: sheet.properties.sheetId,
									    rowIndex: 9,
									    columnIndex: 9
								    },
								    rows: {
								    	"values": [{
									      	"userEnteredValue": {
									        	"stringValue": "beep boop"
									    	}
										}]
									},
								    fields: '*'
							    }
				      		}]
				    	}
					});
			}
		}
	});
*/
});

/*var lolApi = require('leagueapi');

lolApi.init('RGAPI-15331ab0-0857-4cf1-b8d3-37d6f0a11c3a', 'eune');

lolApi.Summoner.getByName('stainlesspot')
	.then(function(summoner) {
		return lolApi.getMatchHistory(summoner.stainlesspot.id, {seasons: 'SEASON2016'});
	})
	.then(function(matchHistory){
		console.log(JSON.stringify(matchHistory));
	})
;

*/



var Team = require('./Team');

var dunkingPoniesSquad = new Team('RGAPI-15331ab0-0857-4cf1-b8d3-37d6f0a11c3a', 'eune', './DunkingPoniesSquad/players.json');

/*var fs = require('fs');	

dunkingPoniesSquad.fetchPlayerIds().then(function (){
	fs.writeFile('players.json', JSON.stringify(dunkingPoniesSquad.players));
});*/



dunkingPoniesSquad.loadPlayers().then(
	() => dunkingPoniesSquad.fetchMatchIds()
).then(matchIds => {
	console.log('\n>>> ' + JSON.stringify(matchIds));

	this.matches = [];

	for(var matchId in matchIds){
		if(matchIds[matchId] == 5)
			this.matches.push({id: matchId});
	}
	console.log('\n>>>' + JSON.stringify(this.matches));
});


/*lolApi.Summoner.getByName('stainlesspot', function(err, response) {
    if(err) {
    	console.log('lolApi generated an error: ' + err);
    }
    lolApi.getMatchHistory(response.stainlesspot.id, {seasons: 'SEASON2016'}, function(err, response){
    	if(err) {
    		console.log('lolApi generated an error: ' + err);
    	}
    	console.log(JSON.stringify(response));
    });
});
*/

/*	googleSheets.values.update(
		{
			valueInputOption: 'raw',
			spreadsheetId: spreadsheetId, 
			range: 'Chart!J10',
			values: ['beep boop']
		},
		function(err, response){
			if(err){
				console.log(err);
				return;
			}

			console.log('Updated Cells: ' + response.updatedCells);
		});


//	console.log(chartWorksheetId ? '"Char" worksheet\'s id is: ' + chartWorksheetId : 'Could not find worksheet "Chart" : ' + chartWorksheetId);


	/*googleSheets.spreadsheets.batchUpdate(
    	spreadsheetId: '1bgMjPHS-3hqKeuburfRNMFpv-k-QvVmZ3gG-ARakPvs',
    	resource: {
      		requests: [
      			updateCells: {
				    start: {
					    sheetId: sheetId,
					    rowIndex: 1,
					    columnIndex: 0
				    },
				    rows: buildRowsForOrders(orders),
				    fields: '*'
			    }
      		]
    	});

  });
/*
  var request = {
    // TODO: Change placeholders below to values for parameters to the 'get' method:

    // Identifies the project addressed by this request.
    project: "",
    // Identifies the managed zone addressed by this request. Can be the managed zone name or id.
    managedZone: "",
    // The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
    changeId: "",
    // Auth client
    auth: authClient
  };

  dns.changes.get(request, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });*/