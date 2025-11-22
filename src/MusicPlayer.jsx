import {useState,useEffect} from "react";
import Playbutton from "./assets/play_button.png";
import Resumebutton from "./assets/resume_button.png";
import nextbutton from "./assets/forward.png";
import prevbutton from "./assets/reverse.png";
import repeatbutton from "./assets/loop.png";
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
    const[loop,setLoop]=useState(false);

    useEffect(()=>{
        globalAudio.src=playlist[currentTrack].src;
        if(start!=0){
            globalAudio.play();
        }
        setStart(start+1);

        globalAudio.onended=()=>{
            setCurrentTrack(prev=>(prev+1)%playlist.length);
        };

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
        globalAudio.volume=e.target.value;
    }

    function repeatSong(){
        const newLoop=!loop;
        setLoop(newLoop);
        globalAudio.loop=newLoop;
    }
    return (
        <div className="card">
        <div className="music-player">
            <h3>{playlist[currentTrack].name}</h3>

            <button className="icon-btn" onClick={prevSong}><img src={prevbutton} alt="Prev"/></button>
            <button className="icon-btn" onClick={playSong}><img src={Playbutton} alt="Play"/></button>
            <button className="icon-btn" onClick={pauseSong}><img src={Resumebutton} alt="Pause"/></button>
            <button className="icon-btn" onClick={nextSong}><img src={nextbutton} alt="Next"/></button>
            <button className="icon-btn" onClick={repeatSong}><img src={repeatbutton} alt="Repeat"/></button>
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