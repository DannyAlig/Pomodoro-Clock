
class Pomodoro extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        currentMode: 'SESSION',
        inMotion: false,
        inProg: false,
        timeLeft: 1500,
        timeLeftDisplay: '25:00',
        sessionLengthDisplay: '25',
        breakLengthDisplay: '5',
        sessionLength: 1500,
        breakLength: 300,
        audioLoaded: false
    };

      this.handleClick=this.handleClick.bind(this)
      this.clockStart=this.clockStart.bind(this)
      this.playSound=this.playSound.bind(this)

    }

    

  
    clockStart(){

        this.setState({
            inMotion: true,
            inProg: true,
        })

        var remain=this.state.timeLeft;




        this.state.appTimer= setInterval(()=>{

            if(this.state.inMotion==false){

                this.setState({
                    timeLeft: remain
                })
    
                clearInterval(this.state.appTimer);
    
                return;            
            }

            remain--;

            var minutes= Math.floor(remain/60);
            var seconds= remain-(minutes*60);

            if(minutes>=10){
                var minutesStr=`${minutes}`;
            } else {
                var minutesStr="0"+`${minutes}`;
            }
             
            if(seconds>=10){
                var secondsStr=`${seconds}`;
            } else{
                var secondsStr="0"+`${seconds}`;
            }
             
           
             var dispTime= minutesStr+":"+secondsStr;
 
             this.setState({
                 timeLeftDisplay: dispTime,
                 timeLeft: remain
              })



            

            if(remain<=0){

                

                if (this.state.currentMode=="SESSION"){
                    let x= this.state.breakLength;

                    var brkMin= Math.floor(x/60);
                    var brkStr=`${brkMin}`+":00";

                    if (brkMin<10){
                        var brkStr= "0"+brkStr;
                    }

                    this.setState({
                        timeLeft: x,
                        timeLeftDisplay: brkStr,
                        currentMode: "BREAK"
                    })
                                      
                } else if(this.state.currentMode=="BREAK"){
                    var x=this.state.sessionLength;

                    var sessMin= Math.floor(x/60);
                    var sessStr=`${sessMin}`+":00";

                    if (sessMin<10){
                        var sessStr= "0"+sessStr;
                    }

                    this.setState({
                        timeLeft: x,
                        timeLeftDisplay: sessStr,
                        currentMode: "SESSION"
                    })
                                        
                }

                this.playSound();

                remain=this.state.timeLeft;
            
            }
                
            
        }, 1000);
    
    }

    handleClick(event){ 

        var clickTarget= event.target.value;

        var motion= this.state.inMotion;
        var sessionLength= this.state.sessionLength;
        var breakLength= this.state.breakLength;

        
        switch(clickTarget){

            case "start_stop":

            
                if(motion===false){                
                    this.clockStart()

                    if(this.state.audioLoaded==false){
                        document.getElementById("beep").load();
                        this.setState({
                            audioLoaded: true
                        })
                    }
                    
                } else

                if(motion===true){
                    var remain= this.state.timeLeft;

                    this.setState({
                        inMotion: false,
                        timeLeft: remain

                    })   
                    
                    clearInterval(this.state.appTimer);
                }
                
                return;
            break;

        
            

            case "reset":

                clearInterval(this.state.appTimer);

                this.setState({
                    currentMode: 'SESSION',
                    inMotion: false,
                    inProg: false,
                    timeLeft: 1500,
                    sessionLength: 1500,
                    breakLength: 300,
                    timeLeftDisplay: '25:00',
                    sessionLengthDisplay: '25',
                    breakLengthDisplay: '5'
                    
                })

                

                

                $("#beep").trigger("pause");
                document.getElementById("beep").currentTime= 0;

                return;
            break;

            case "session-increment":
            case "session-decrement":
                
                if(clickTarget=="session-increment" && sessionLength<=3540){
                sessionLength += 60;
                }

                if(clickTarget=="session-decrement" && sessionLength>60){
                    sessionLength -= 60;
                }
            
                var sessMin= Math.floor(sessionLength/60);
                var sessStr=`${sessMin}`;

                if (sessMin<10){
                    var timeStr= "0"+sessStr+":00";
                }else{
                var timeStr= sessStr+":00";
                }

                this.setState({
                    sessionLength: sessionLength,
                    sessionLengthDisplay: sessStr
                })

                if(this.state.inProg==false){

                    this.setState({
                        timeLeft: sessionLength,
                        timeLeftDisplay: timeStr
                    })
                }


            break;

            case "break-increment":
            case "break-decrement":
                
                if(clickTarget=="break-increment" && breakLength<=3540){
                breakLength += 60;
                }

                if(clickTarget=="break-decrement" && breakLength>60){
                    breakLength -= 60;
                }
            
                var breakMin= Math.floor(breakLength/60);
                var breakStr = `${breakMin}`;
                

                this.setState({
                    breakLength: breakLength,
                    breakLengthDisplay: breakStr
                })


            break;
            

            default:
            return;

        }

    }

    playSound(){
        $('#beep').trigger("play");
    
    }

 
    componentDidMount() {  
        $(".clickable").click(this.handleClick);
        this.handleClick();
        this.clockStart();
        this.playSound();
      }



    
  
    render(){

      return(
        <div id="app-wrap">
            <div id="all-display">
                <div id="display-container">

                    <div id="title-text">
                         <span>Pomodoro Clock</span>
                    </div>

                    <div id="top-center-container" className="centered-col-flexbox">
                        
                        <div id="timer-display" className="centered-col-flexbox">
                            <div id="timer-label" className="display-label">{this.state.currentMode}</div>
                            <div id="digit-box" >
                                <div id="time-left">{this.state.timeLeftDisplay}</div>
                            </div>
                            
                        </div>

                        <audio id="beep">
                      
                            <source src="audio\echord.ogg" type="audio/ogg" />
                            <source src="audio\echord.mp3" type="audio/mpeg"/>
                            Your browser does not support the audio element.

                        </audio>
                        
                        <div id="top-button-box" className="button-box">

                            <button id="start_stop" className="button-icon2 clickable" value="start_stop"><i className="fas fa-play"></i>&nbsp;<i className="fas fa-pause"></i></button>
                            
                            <button id="reset" className="button-icon2 clickable" value="reset"><i className="fas fa-fast-backward"></i></button>
                        </div>


                    </div>

                    

                    <div id="bottom-container" className="centered-col-flexbox">
                        <div id="session-box" className="centered-col-flexbox">

                            <span id="session-label" className="display-label">Session<br/>Length</span>
                            <div id="session-length" className="setting-display">{this.state.sessionLengthDisplay}</div>
                            <div className="button-box button-icon">
                                <button id="session-increment" className="arrow-button clickable" value="session-increment"><i className="fas fa-caret-up"></i></button>
                                <button id="session-decrement" className="arrow-button clickable" value="session-decrement"><i className="fas fa-caret-down"></i></button>
                            </div>
   
                        </div>

                        <div id="break-box" className="centered-col-flexbox">

                            <span id="break-label" className="display-label">Break<br/>Length</span>
                            <div id="break-length" className="setting-display">{this.state.breakLengthDisplay}</div>
                            <div className="button-box button-icon">
                                <button id="break-increment" className="arrow-button clickable" value="break-increment"><i className="fas fa-caret-up"></i></button>
                                <button id="break-decrement" className="arrow-button clickable" value="break-decrement"><i className="fas fa-caret-down"></i></button>
                            </div>
   
                        </div>
                    </div>
                
                
                
                </div>

                 <div id="instructions">
                     <span><a href='https://en.wikipedia.org/wiki/Pomodoro_Technique' target='_blank'>What is the Pomodoro Technique?</a></span>
                 </div>

            </div>

            <footer id="footbox">
                <span id="foot-text">Designed and Coded by Danny Alig</span>
            </footer>
        </div>
      );
    }
  
}
  

ReactDOM.render(<Pomodoro />, document.getElementById("app"));


