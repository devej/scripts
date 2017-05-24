//
// resetplaycount.js
//
// For the currently seleced tracks, set the playcount and playeddate
// and reset the skip count to 0
//

var ITTrackKindFile = 1;
var iTunesApp = WScript.CreateObject( "iTunes.Application" );
var tracks = iTunesApp.SelectedTracks;

for( var i = 1; i <= tracks.Count; ++i )
{
	var currTrack = tracks.Item( i );
	
	if( currTrack.Kind == ITTrackKindFile )
	{
		currTrack.PlayedCount = 24				// set your own useful number here
		//currTrack.PlayedDate = "5/24/2017";	// want to set a date too?
		currTrack.SkippedCount = 0;				// reset the (mostly) unused skipcount
	}
}
