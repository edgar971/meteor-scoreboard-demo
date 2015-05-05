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
			PlayersList.update({ _id: selectedPlayer }, {$inc: {score : 1}});
		},
		"click #decrease-score" : function () {
			var selectedPlayer = Session.get('selectedPlayer');
			PlayersList.update({ _id: selectedPlayer }, {$inc: {score : -1}});
		},
		"click #remove-player" : function () {
			var selectedPlayer = Session.get('selectedPlayer');
			PlayersList.remove(selectedPlayer);
		}
	});
	Template.ActionButtons.IsPlayerSelected = function() {
		var selectedPlayer = Session.get('selectedPlayer');
		if(selectedPlayer == null) {
			return "disabled";
		}
	};
	Template.AddPlayerFormTemplate.events({
		"submit #addPlayerForm" : function(event, template) {
			event.preventDefault();
			var newPlayerName = template.find("#NewPlayerName").value;
			if(newPlayerName != null) {
				PlayersList.insert({
					name: newPlayerName,
					score: 0
				});
				template.find("#NewPlayerName").value = null;
			}
		}
	})
}

if(Meteor.isServer) {
	Meteor.publish('thePlayers', function() {
		return PlayersList.find();
	});
}