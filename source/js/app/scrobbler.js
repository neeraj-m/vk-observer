class Scrobbler {
    constructor() {}

    scrobble(songArtist, songTitle, statusIcon) {
        let scrobbleStatus = localStorage.VkObserver_scrobble,
            storage = chrome.storage.sync;

        storage.get('lastkeys', (data) => {
            let apiKey = data.lastkeys.api,
                apiSecret = data.lastkeys.secret,
                ts = Math.floor(new Date().getTime()/1000),
                lastfm = new LastFM({
                    apiKey: apiKey,
                    apiSecret: apiSecret
                });

            storage.get('lastsession', (data) => {
                const sk = data.lastsession;
                let startScrobble = () => {
                    lastfm.track.scrobble(
                    	{artist: songArtist, track: songTitle, timestamp: ts},
                    	{key: sk},
                    	{
                    		success: (data) => {
                        		statusIcon.className = 'scrobbled';
                        		statusIcon.setAttribute('title', 'scrobbled');
                        		//console.log("Заскробблен! " + songArtist + " " + songTitle);
                    		},
                    		error: (code, message) => {
                        		console.log("Error: " + message + " code: " + code);
                    		}
                		}
                	);
                }

                if (
                  scrobbleStatus === 'enabled' &&
                  songArtist !== null &&
                  songArtist !== undefined
                ) {
                    startScrobble();
                }
            });

        });

    }


    likeSong(songArtist, songTitle, likeIcon) {
        let scrobbleStatus = localStorage.VkObserver_scrobble,
            storage = chrome.storage.sync;

        storage.get('lastkeys', (data) => {
            let apiKey = data.lastkeys.api,
                apiSecret = data.lastkeys.secret,
                ts = Math.floor(new Date().getTime()/1000),
                lastfm = new LastFM({
                    apiKey: apiKey,
                    apiSecret: apiSecret
                });

            storage.get('lastsession', (data) => {
                const sk = data.lastsession;
                let like = () => {
                    	lastfm.track.love(
                    		{artist: songArtist, track: songTitle},
                    		{key: sk},
                    		{
                    			success: (data) => {
                        			likeIcon.className = 'liked';
                        			likeIcon.setAttribute('title', 'Add to favourites');
                        			//console.log("Added to favorite! " + songArtist + " " + songTitle);
                    			},
                    			error: (code, message) => {
                        			console.log("Error: " + message + " code: " + code);
                    			}
                			}
                		);
                	},
                	unlike = () => {
                    	lastfm.track.unlove(
                        	{artist: songArtist, track: songTitle},
                        	{key: sk},
                        	{
                        		success: (data) => {
                        	    	likeIcon.className = 'unliked';
                            		likeIcon.setAttribute('title', 'Remove from favourites');
                            		//console.log("Removed from favorites! " + songArtist + " " + songTitle);
                        		},
                        		error: (code, message) => {
                        			console.log("Error: " + message + " code: " + code);
                        		}
                    		}
                    	);
                	};

                if (
                  scrobbleStatus === 'enabled' &&
                  songArtist !== null &&
                  songArtist !== undefined &&
                  likeIcon.className !== 'changed'
                ) {
                    if(
                      likeIcon.className !== 'liked' ||
                      likeIcon.className === 'unliked'
                    ) {
                        like();
                    } else {
                        unlike();
                    }
                }

            });

        });

    }
}

export default Scrobbler
