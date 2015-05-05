PlayersList = new Meteor.Collection('Players');

if(Meteor.isClient){
	Meteor.subscribe("thePlayers");
	Template.LeaderBoardList.player = function(){
		//sort -1 means descending order. 1 means ascending 
		return PlayersList.find({}, {sort: {score: -1, name: 1}});
	};
	Template.LeaderBoardList.selectedClass = function(){
		var playerID = this._id,
			selectedPlayer = Session.get('selectedPlayer');
		
		if(playerID == selectedPlayer) {
			return "blue-grey lighten-5";
		}
		
	};
	Template.LeaderBoardList.events({
		"click li" : function() {
			//get id from user on database
			var playerID = this._id;
			//set the session
			Session.set("selectedPlayer", playerID);
		}
	});
	Template.ActionButtons.events({
		"click #increase-score" : function() {
			var selectedPlayer = Session.get('selectedPlayer');
 			Meteor.call("modifyPlayerScore", selectedPlayer, 1);
		},
		"click #decrease-score" : function () {
			var selectedPlayer = Session.get('selectedPlayer');
 			Meteor.call("modifyPlayerScore", selectedPlayer, -1);
		},
		"click #remove-player" : function () {
			var selectedPlayer = Session.get('selectedPlayer');
			Meteor.call("removePlayer", selectedPlayer);
		}
	});
	Template.ActionButtons.IsPlayerSelected = function() {
		var selectedPlayer = Session.get('selectedPlayer');
		if(selectedPlayer == null) {
			return "disabled";
		}
	};
	Template.AddPlayerFormTemplate.events({
		"submit #addPlayerForm" : function(event) {
			event.preventDefault();
			var newPlayerName = event.target.NewPlayerName.value;
			
			if(newPlayerName != null) {
				Meteor.call("AddPlayerData", newPlayerName);
				newPlayerName = null;
				event.target.NewPlayerName.value = null;
			}
		}
	})
}

if(Meteor.isServer) {
	//data
	Meteor.publish('thePlayers', function() {
		return PlayersList.find();
	});
	
	//methods
	Meteor.methods({
		"AddPlayerData" : function (newPlayerName) {
			PlayersList.insert({
				name: newPlayerName,
				score: 0
			});
		},
		"removePlayer" : function (playerId) {
			PlayersList.remove(playerId);
		},
		"modifyPlayerScore" : function (playerId, value) {
			PlayersList.update({ _id: playerId }, {$inc: {score : value}});
		}
	});
}