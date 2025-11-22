import {useState,useEffect} from "react";
import MusicPlayer from './MusicPlayer.jsx'

function SidePanel(){
   const[open,setOpen]=useState(false);
   return(
    <div>
     <button 
        className="menu-button"
        onClick={() => setOpen(true)}
      >
        🎵
      </button>

      {/* SIDEBAR */}
      <aside className={open ? "sidebar open" : "sidebar"}>
        
        {/* Close button */}
        <button 
          className="close-btn"
          onClick={() => setOpen(false)}
        >
          ✖
        </button>

        <MusicPlayer />
      </aside>
    </div>
   );
}

export default SidePanel;