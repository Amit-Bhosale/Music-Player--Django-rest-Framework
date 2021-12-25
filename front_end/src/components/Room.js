import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage"
import Musicplayer from "./Musicplayer";


export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestcanPause: false,
      isHost: false,
      showSettings:false,
      spotifyAuthenticated:false,
      song:{},
    };
    
    this.roomCode = this.props.match.params.roomCode;
    this.updateShowSettings=this.updateShowSettings.bind(this);
    this.leaveButtonPressed=this.leaveButtonPressed.bind(this);
    this.renderSettingsButtons=this.renderSettingsButtons.bind(this);
    this.renderSettings=this.renderSettings.bind(this);
    this.getRoomDetails=this.getRoomDetails.bind(this);
    this.authenticatedSpotify=this.authenticatedSpotify.bind(this);
    this.getCurrentSong=this.getCurrentSong.bind(this);
    this.getRoomDetails();
    this.getCurrentSong();
  }
  
   componentDidMount(){
    this.interval=setInterval(this.getCurrentSong, 2000);
  }

   componentWillUnmount(){
      clearInterval(this.interval);
  }


  getRoomDetails() {
    fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if(!response.ok){
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestcanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if(this.state.isHost){
        this.authenticatedSpotify();
      }
      });
  }

  authenticatedSpotify(){
    fetch("/spotify/is-authenticated").then((response)=>response.json()).
    then((data)=>{
      this.setState({spotifyAuthenticated:data.status});
      if(!data.status){
        fetch('/spotify/get-auth-url').then((response)=>response.json()).then((data)=>{
          window.location.replace(data.url);
        })
      }
      console.log(this.state.spotifyAuthenticated)
    });
  }


  leaveButtonPressed(){
      const requestOptions={
          method:'POST',
          headers:{'Content-Type':'applications/json'},
      };
      fetch("/api/leave-room",requestOptions).then((_response)=>{
        this.props.leaveRoomCallback(); 
        this.props.history.push('/');
      })
  }

  updateShowSettings(value){
      this.setState({showSettings:value,})
  }


  renderSettingsButtons(){
    return(
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={()=>this.updateShowSettings(true)}>Settings</Button>
      </Grid>

    );
  }

  renderSettings(){
    return(
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage update={true} votestoskip={this.state.votesToSkip} guestCanPause={this.state.guestcanPause} roomCode={this.roomCode} updateCallback={this.getRoomDetails} />
        </Grid>
        <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={()=>this.updateShowSettings(false)}>Close</Button> 
        </Grid>
      </Grid>
    );
  }

   getCurrentSong(){
    fetch('/spotify/current-song').then((response)=>{
      if (!response.ok) {
        return {'error':'NOt Found'};
      }else{
        return response.json();
      }
    }).then((data)=> {this.setState({song:data})
   console.log(data)
  });

  }


  render() {
    if (this.state.showSettings) {
      return this.renderSettings(); 
    }
    return (
      <Grid id spacing={1} container>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Room Code : {this.roomCode}
          </Typography>
        </Grid>
        <Musicplayer {...this.state.song}/>
        {this.state.isHost ? this.renderSettingsButtons():null}
        <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={this.leaveButtonPressed}>Leave Room</Button> 
        </Grid>
      </Grid>

      
    );
  }

}
