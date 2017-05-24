// /cygdrive/c/windows/system32/cscript -nologo
// jscript to create my Least Played Favorites playlist
//
// get all songs rated >= 3 stars
// sort by play count
// sort by last played date
// select the first 75
//

var iTunesApp = WScript.CreateObject( "iTunes.Application" );
var libraryPlaylist = iTunesApp.LibraryPlaylist;
//var iTracks = iTunesApp.LibraryPlaylist.Tracks;

var MAXTRACKS = 75;
var lpf = new Array();	// the tracks for the lpf playlist

main();


// sort operator
function CompareTracksByPlayedCount( a, b )
{
	if( a.PlayedCount < b.PlayedCount )
		return -1;

	if( a.PlayedCount > b.PlayedCount )
		return 1;

	return 0;
}

// another sort operator
function CompareTracksByPlayedDate( a, b )
{
	if( a.PlayedDate < b.PlayedDate )
		return -1;

	if( a.PlayedDate > b.PlayedDate )
		return 1;

	return 0;
}


function main()
{
	// lookup and delete old playlist if it exists
	var list = iTunesApp.LibrarySource.Playlists.ItemByName( "lpf" );
	if( list ) {
		clear_playlist( list );
		//list.Delete();
	} else {
		list = iTunesApp.CreatePlaylist( "lpf" );
	}

	
	var threeplus = iTunesApp.LibrarySource.Playlists.ItemByName( "3+*" );

	if( !threeplus ) {
		WScript.StdOut.Writeline( "Playlist 3+* NOT FOUND - ABORTING!" );
		return;
	}

	WScript.StdOut.Writeline( "3+* has : " + threeplus.Tracks.count + " tracks totalling " + threeplus.duration + " seconds." );
	var alltracks = new Array();
	
	// grab all the  tracks into an array we can sort
	for( var i = 1; i < threeplus.Tracks.count+1; ++i )
	{
		alltracks.push( threeplus.Tracks.Item(i) );
	}

	// sort by playedcount
	WScript.StdOut.Writeline( "Sorting 3+* by play count" );
	alltracks.sort( CompareTracksByPlayedCount );
	WScript.StdOut.Writeline( "3+* sorted by play count" );
	
	var lpfcandidates = new Array();
	var lastcount = 0;

	for( var i = 0; i < alltracks.length; ++i )
	{
		if( alltracks[i].PlayedCount != lastcount )
		{
			// starting a new play count
			lastcount = alltracks[i].PlayedCount;
			if( lpfcandidates.length > MAXTRACKS )
			{
				break;
			}
		}

		lpfcandidates.push( alltracks[i] );
	}

	WScript.StdOut.Writeline( "LPF Candiates has " + lpfcandidates.length + " tracks" );

	var sometracks = new Array();
	lastcount = lpfcandidates[0].PlayedCount;
	WScript.StdOut.Writeline( "Lastcount = " + lastcount );

	for( var i = 0; i < lpfcandidates.length; ++i )
	{
		if( lastcount != lpfcandidates[i].PlayedCount )
		{
			var done = process_tracks( sometracks );
			if( 1 == done ) {
				break;
			}
			sometracks = new Array();
			lastcount = lpfcandidates[i].PlayedCount;
		}

		sometracks.push( lpfcandidates[i] );
	}

	process_tracks( sometracks );
	WScript.StdOut.Writeline( "LPF has " + lpf.length + " entries." );

	for( var i = 0; i < lpf.length; ++i )
	{
		WScript.StdOut.Writeline( "Added: " + lpf[i].Name + " :: " + lpf[i].PlayedCount + " :: " + lpf[i].PlayedDate );
		list.AddTrack( lpf[i] );
	}
	
	return;
}


function clear_playlist( alist )
{
	// I wish I knew if iTunes had a playlist .clear function

	// Delete from the bottom up.
	// It's a little faster because indicies
	// don't need recalculating because
	// nothing shifts off the front.
	var numtracks = alist.Tracks.count;

	for( var i = numtracks; i > 0; --i )
	{
		alist.Tracks.item(i).Delete();
	}
}


function process_tracks( tracks )
{
		tracks.sort( CompareTracksByPlayedDate );

		for( var i = 0; i < tracks.length; ++i )
		{
			if( lpf.length >= MAXTRACKS ) {
				return 1; // 1 == done
			}
			
			lpf.push( tracks[i] );
		}

		return 0; // 0 == not done
}

