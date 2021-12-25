import React, {Component} from 'react';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";  


export default class CreateRoomPage extends Component{
    static defaultProps={
        votestoskip:2,
        guestCanPause:true,
        update:false,
        roomCode:null,
        updateCallback:()=>{},
    }

    constructor(props) {
        super(props);
        this.state={
            guestCanPause: this.props.guestCanPause,
            votestoskip: this.props.votestoskip,
            errorMsg:"",
            SuccessMsg:"",
        };
        this.handleRoomButtonPressed=this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange=this.handleVotesChange.bind(this);
        this.handleGuestcanpausechange=this.handleGuestcanpausechange.bind(this);
        this.handleUpdateButtonPressed=this.handleUpdateButtonPressed.bind(this);
    }

    handleVotesChange(e){
        this.setState({
            votestoskip:e.target.value,

        });
    }   

    handleGuestcanpausechange(e){
        this.setState({
            guestCanPause:e.target.value==="true" ? true : false,
        });
    }

    handleRoomButtonPressed(){
        const requestOptions={
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                votes_to_skip:this.state.votestoskip,
                guest_can_pause:this.state.guestCanPause
            }),
        };
        fetch('/api/post/',requestOptions).then((response)=>
        response.json()).then((data)=>this.props.history.push('/room/' + data.code));    
    }

    handleUpdateButtonPressed(){
        const requestOptions={
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                votes_to_skip:this.state.votestoskip,
                guest_can_pause:this.state.guestCanPause,
                code:this.props.roomCode
            }),
        };
        fetch('/api/update-room',requestOptions)
        .then((response)=>{
            if (response.ok) {
                this.setState({
                    successMsg:"Room updated Successfully"
                })
            } else {
                errorMsg:"Something Went Wrong"
            }
            this.props.updateCallback();
        });
    }


    renderCreateButtons(){
        return(
        <Grid container spacing={1}>    
        <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" component={Link} onClick={this.handleRoomButtonPressed}>Create a Room</Button>
        </Grid>
        <Grid item xs={12} align="center">
            <Button color="primary" variant="contained" to='/' component={Link}>Back</Button>
        </Grid>
        </Grid>
        );
    }

    renderUpdateButtons(){
        return(
            <Grid container spacing={1}>    
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" component={Link} onClick={this.handleUpdateButtonPressed}>Update Room</Button>
            </Grid>
            </Grid>
        )
    }

    render(){
        const title=this.props.update? "Update Room" : "Create a Room"
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                        {this.state.successMsg != ""?(<Alert severity="success" onClose={()=>{this.setState({successMsg:""});}}>{this.state.successMsg}</Alert>):(<Alert severity="error" onClose={()=>{this.setState({errorMsg:""});}} >{this.state.errorMsg}</Alert>)}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">{title}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component={"fieldset"}>
                        <FormHelperText>
                            <div align="center">
                                Guest Control or PlayBack State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestcanpausechange}>
                            <FormControlLabel value='true' 
                            control={<Radio color="primary"/>}
                            label="Play/Pause"
                            labelPlacement="bottom"
                            />
                            <FormControlLabel value='false' 
                            control={<Radio color="secondary"/>}
                            label="No Control"
                            labelPlacement="bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required={true} type="number" 
                        onChange={this.handleVotesChange}
                        defaultValue={this.state.votestoskip}
                        inputProps={
                            {min:1,
                            style:{textAlign:"center"},}
                        }
                        ></TextField>
                        <FormHelperText>
                            <div align='center'>Votes required to skip the Song</div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update?this.renderUpdateButtons():this.renderCreateButtons()}
            </Grid>
        );    
    }
}