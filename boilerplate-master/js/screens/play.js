game.PlayScreen = me.ScreenObject.extend({
	
	onResetEvent: function() {
		// load a level
		me.levelDirector.loadLevel("area01");
		// add a default HUD to the game manager
		me.game.addHUD(0, 430, 640, 60);
		// add a new HUD item
		me.game.HUD.addItem("score", new game.ScoreObject(620, 10));
		// make sure everything is in the right order
		me.game.sort();
		// play the background music
		me.audio.playTrack("DST-InertExponent");
	},
	
	// action to perform when game is finished (state change)
	onDestroyEvent: function() {
		// remove HUD
		me.game.disableHUD();
		// stop the current audio track
		me.audio.stopTrack();
	}
});
