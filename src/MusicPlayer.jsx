import {useState,useEffect} from "react";

export const globalAudio=new Audio();

function MusicPlayer(){
    const [playlist,setPlaylist]=useState([
    {name:"Lofi Study Music",src: "/sounds/Study_music.mp3"},
    {name:"Magical Moments",src:"/sounds/Magical-Moments.mp3"},
    {name:"Rain",src:"/sounds/Rain.mp3"},
    {name:"Surreal Forest",src:"/sounds/Surreal-forest.mp3"}
    ]);
    const[currentTrack,setCurrentTrack]=useState(0);
    const[start,setStart]=useState(0);

    useEffect(()=>{
        globalAudio.src=playlist[currentTrack].src;
        if(start!=0){
            globalAudio.play();
        }
        setStart(start+1);

    },[currentTrack]);

    function playSong(){
    globalAudio.play();
    }
    function pauseSong(){
        globalAudio.pause();
    }
    function nextSong(){
        globalAudio.pause();

        setCurrentTrack((prev)=>{
            return (prev+1)%playlist.length;
        })

        globalAudio.play();

    }
    function prevSong(){
        globalAudio.pause();

        setCurrentTrack((prev)=>prev===0 ? playlist.length-1 : prev-1);

        globalAudio.play();
    }

    function volumeControl(e){
        audioRef.current.volume=e.target.value;
    }

    return (
        <div className="card">
        <div className="music-player">
            <h3>{playlist[currentTrack].name}</h3>

            <button onClick={prevSong}>Prev</button>
            <button onClick={playSong}>Play</button>
            <button onClick={pauseSong}>Pause</button>
            <button onClick={nextSong}>Next</button>
            <h3>Volume</h3>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={volumeControl}
            />

        </div>
        </div>
    );
}

export default MusicPlayer;