import {useEffect,useState} from "react";
import {useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
//import MusicPlayer from './MusicPlayer.jsx'
import SidePanel from "./SidePanel.jsx"
import { globalAudio} from "./MusicPlayer.jsx";

const studyMusic=new Audio("/sounds/Study_music.mp3");
const startSound= new Audio("/sounds/start.mp3");
const buttonSound= new Audio("/sounds/button.mp3");
const finishedSound= new Audio("/sounds/Finished.mp3");

function App(){
    const [mode,setMode]=useState("focus");
    const[durations,setDurations]=useState({
      focus:1*60,
      break:5*10,
    });
    const[timerType,setTimerType]=useState("regular");
    const [timeLeft, setTimeLeft]=useState(durations.focus);
    const [isRunning,setIsRunning]=useState(false);
    const[count,setCount]=useState(0);
    const[screen,setScreen]=useState("start");
    const[digits,setDigits]=useState(["","","","","",""]);
    const[focusMinutes,setFocusMinutes]=useState("");
    const[breakMinutes,setBreakMinutes]=useState("");
    const[sessions,setSessions]=useState(1);

    const[showPlayer,setShowplayer]=useState(false);

    
    const digitRefs=useRef([]);

    function handleDigitChange(index,value){
      //allow empty string
      if(value===""){
        const updated=[...digits];
        updated[index]="";
        setDigits(updated);
        return;
      }
      //allow only digits
      if(!/^[0-9]$/.test(value)) return;

      //shallow copy of digits
      const updated=[...digits];   //... spreads the elements eg: [1,2,3] => 1,2,3 and [] puts it in an array.
      updated[index]=value;
      setDigits(updated);
      
      //autojump to next box
      if(timerType==="regular" && index<5){
        digitRefs.current[index+1].focus();
      }
    }

    function handleKeyDown(index,e){
      if(e.key==="Backspace" && digits[index]===""){
        if(index>0){
          digitRefs.current[index-1].focus();
        }
      }
    }
    function startTimerFromDigits(){
      const hours = Number(digits[0])*10+ Number(digits[1]);
      const minutes= Number(digits[2])*10 +Number(digits[3]);
      const seconds= Number(digits[4])*10 +Number(digits[5]);

      const total=hours*3600 + minutes*60 + seconds;

      if(total==0)return; //dont start if empty

      globalAudio.pause();
      globalAudio.currentTime=0;
      globalAudio.play();
      setTimeLeft(total);
      setScreen("running");
      setIsRunning(true);

      return hours,minutes,seconds;
    }

    function formatTime(seconds){
      const hours= Math.floor(seconds/3600);
      const minutes = Math.floor((seconds % 3600) /60);
      const secs= seconds % 60;
      return `${hours}:${minutes}:${secs.toString().padStart(2,"0")}`;
    }
  useEffect(()=>{
    if(!isRunning) return;
    
    const interval=setInterval(()=>{
      setTimeLeft((prev)=>{
        if(prev===0){
          return 0;
        }
        return prev-1;
    });
  },1000);
  return ()=> clearInterval(interval);
    
  }, [isRunning]);

  useEffect(()=>{
    if(timerType==="pomodoro" && timeLeft==0 && mode==="focus"){
      //switch to break mode
      finishedSound.play();
      setSessions(sessions-1);
      setMode("break")
      setTimeLeft(durations.break);
    }
    else if(timerType==="pomodoro" && mode==="break" && timeLeft==0){
      if(sessions==0){
        finishedSound.play();
        globalAudio.pause();
        globalAudio.currentTime=0;
        finishedSound.play();
        setIsRunning(false);
        setScreen("done");
      }
      else{
        finishedSound.play();
        setMode("focus");
        setTimeLeft(durations.focus);
      }
      
    }

    else if(timeLeft==0 && isRunning){
      globalAudio.pause();
      globalAudio.currentTime=0;
      finishedSound.play();
      setIsRunning(false);
      setScreen("done");
    }
  
  },[timeLeft, isRunning]);

  return (
  <div>
    <SidePanel/>
    <AnimatePresence mode="wait">
        
    {screen==="start" && (
      <div className="start-screen">
      
      
        <motion.div className="card"
          key="start"
          initial={{opacity:0,y:20}}
          animate={{opacity:1 ,y:0}}
          exit={{opacity:0,y:-20}}
          transition={{duration:0.9}}
        >
        <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.25}} onClick={()=> {
          startSound.play();
          setScreen("choose");
          setIsRunning(false);
          setTimeLeft(0);
          setDigits(["","","","","",""]);
        }}>Study with me</motion.button>
      </motion.div>
      </div>
    )}
    
    {screen==="choose" &&(
      <div className="choose-screen">
        <motion.div className="card"
          key="choose"
          intial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-20}}
          transition={{duration:0.70}}
          >
            <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.1}} onClick={()=>{
              buttonSound.play();
              setTimerType("pomodoro");
              setScreen("pomodoro");
            }}>Pomodoro</motion.button>
            <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.1}} onClick={()=>{
              buttonSound.play();
              setTimerType("regular");
              setScreen("regular");
            }}>Regular</motion.button>
          </motion.div>
      </div>
    )}

    {screen==="pomodoro" &&(
      <div className="pomodoro-screen">
        <motion.div className="card"
          key="pomodoro"
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-20}}
          transition={{duration:0.70}}>
            <h2>Set Pomodoro Timer</h2>
            
            <div className="digit-container">
              <h3>Focus Time</h3>
              <input
              type="number"
              min="1"
              placeholder="Focus Minutes"
              value={focusMinutes}
              onChange={(e)=> {
                //to prevent negative numbers
                const value=e.target.value;

                if(value===""){
                  setFocusMinutes("");
                  return;
                }

                if(Number(value)<0){
                  return;
                }
                else{
                  setFocusMinutes(value);
                }
              }}

              />
              <h3>Break Time</h3>
              <input
                type="number"
                min="1"
                placeholder="Break mintues"
                value={breakMinutes}
                onChange={(e)=>{
                  const value=e.target.value;
                  if(value===""){
                    setBreakMinutes("");
                    return;
                  }
                  
                  if(Number(value)<0){
                    return;
                  }
                  else{
                    setBreakMinutes(value);
                  }
                }}

              />
              <h3>Number of Sessions</h3>
              <input
                type="number"
                placeholder="1"
                value={sessions}
                onChange={(e)=>setSessions(e.target.value)}
                />
            </div>

            <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.25}} onClick={()=>{
              
              buttonSound.play();
              const focusSeconds=Number(focusMinutes)*60;
              const breakSeconds=Number(breakMinutes)*60;

              setDurations({
                focus:focusSeconds,
                break:breakSeconds,
              });

              globalAudio.pause();
              globalAudio.currentTime=0;
              globalAudio.play();
              
              setMode("focus");
              setTimeLeft(focusSeconds);
              setIsRunning(true);
              setScreen("running");

            }}>Start</motion.button>

          </motion.div>
      </div>
    )

    }
    {screen==="regular" &&(
      <div className="set-screen">
        <motion.div className="card"
          key="set"
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-20}}
          transition={{duration:0.70}}
        >
          <h2>Set Timer</h2>
          <div className="digit-container">
          {
          digits.map((digit,index)=>(
            <input
            ref={(el)=>(digitRefs.current[index]=el)}
            type="text"
            key={index}
            value={digit}
            placeholder="0"
            maxLength={1}
            onChange={(e)=>handleDigitChange(index,e.target.value)}
            onKeyDown={(e)=>handleKeyDown(index,e)}
            className="digit-box"
            />
          ))}
          </div>
          <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.05}} onClick={()=>
          {buttonSound.play();
          startTimerFromDigits();}}>Start</motion.button>
        </motion.div>
      </div>
    )}

    {screen==="running" &&(
      <div className="running-screen">
        

        <motion.div className="card"
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-20}}
          transition={{duration:0.5}}
        >
       <h2>{mode==="focus" ? "Study!" : "Break" }</h2>
        <p className="timer" >
        <div className="box">{formatTime(timeLeft)}</div>
        </p>

        <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.05}} onClick={()=>{
          buttonSound.play();
          globalAudio.pause();
          setIsRunning(false);
          setScreen("paused");
        }
        }>
          Pause
        </motion.button>

        <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.05}} onClick={()=>{
          buttonSound.play();
          globalAudio.pause();
          globalAudio.currentTime=0;
          setIsRunning(false);
          setScreen("done");
        }}>Stop</motion.button>
        </motion.div>
      </div>
    )
    }

    {screen==="paused" &&(
      <div className="paused-screen">
        <motion.div className="card"
          key="paused"
          initial={{opacity:0,y:0}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:0}}
          transition={{duration:0.7}}
          >
         <h2>Paused</h2>
        <p className="timer" >
        <div className="box">{formatTime(timeLeft)}</div>
        </p>

        <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.05}} onClick={()=>{
          buttonSound.play();
          globalAudio.play();
          setIsRunning(true);
          setScreen("running");
        }
        }>
          Resume
        </motion.button>

        <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.05}} onClick={()=>{
          buttonSound.play();
          setIsRunning(false);
          setScreen("done");
        }}>Stop</motion.button>
      </motion.div>
      </div>
    )}

    {screen==="done" &&(
      <div className="done-screen">
        <motion.div className="card"
          key="done"
          inital={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-20}}
          transition={{duration:0.45}}
        >
        <p>Great Work!!</p>
        <motion.button whileTap={{scale:0.95}} whileHover={{scale:1.25}} onClick={()=>{
          buttonSound.play();
          setScreen("start");
        }}>Back to Start</motion.button> 
      </motion.div>
      </div>
    )}
    </AnimatePresence>
  </div>);
  
}

export default App;