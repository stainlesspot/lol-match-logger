'use struct';

var lolApi = require('leagueapi');

var Team = function (apiKey, region, dataFile){
	lolApi.init(apiKey, region);
	
	this.dataFile = dataFile;
};

Team.prototype.fetchPlayerIds = function (){
	console.log('\nStarted fetching player ids from api...');

	return Promise.all(this.players.map(
		player => lolApi.Summoner.getByName(player.name)
	)).then(summoners => {
		this.players.forEach((player, index) => player.id = summoners[index][player.name].id);
		console.log('...Done!');
	}).catch(err => console.log('Failed to fetch data from api: ' + err));
};

Team.prototype.loadPlayers = function (){
	var fs = require('fs');

	console.log('\n>>> Started loading players from file...')

	return new Promise((resolve, reject) => fs.readFile(this.dataFile, (err, data) => {
		if(err) reject(err);
		else resolve(data);
	})).then(data => {
		this.players = JSON.parse(data);
		console.log('...Done!');
	}).catch(err =>	console.log('\n>>> Failed to fetch data from file: ' + err));
};

function wait(miliseconds, callback){
	return new Promise((resolve, reject) => setTimeout(
		() => callback()
			.then(response => resolve(response))
			.catch(err => reject(err)),
	miliseconds))
}

Team.prototype.fetchPlayerMatchHistory = function(player){
	console.log('\n>>> Started fetching ' + JSON.stringify(player) + '\'s match history...');

	return lolApi.getMatchHistory(player.id, {seasons: 'SEASON2016'}).then(
		matchList => matchList.matches.map(match => match.matchId)
	).catch(err => {
		console.log('\n>>> Fetching player ' + JSON.stringify(player) + '\'s match history failed: ' + err + '. Retrying after 12 seconds');
		return wait(12000, () => this.fetchPlayerMatchHistory(player));
	});
};

Team.prototype.fetchMatchIds = function (){
	console.log('\n>>> Started fetching matches...');

	return Promise.all(
		this.players.map(player => this.fetchPlayerMatchHistory(player))
	).then(response => response.reduce(
		(helper, matchIds) => {
			matchIds.forEach(matchId => {
				if(helper[matchId])
					helper[matchId]++;
				else
					helper[matchId] = 1;
			});
			return helper;
		}, {}
	)).catch(err => {
		console.log('\n>>> Fetching matches failed (' + err + '), retrying after 30 seconds...');
		return wait(30000, () => this.fetchMatches());
	})
};

Team.prototype.print = function(){
	console.log(JSON.stringify(this.players));
};

module.exports = Team;