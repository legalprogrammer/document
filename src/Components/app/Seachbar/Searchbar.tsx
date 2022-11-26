import * as React from "react";
import   "../../assests/CSS/main.css";
import Helpbar from "../Seachbar/help"
import Result from '../Results/result';
import { Icon,Button, Container } from 'semantic-ui-react';
/* This component is for the search bar */

interface SearchbarState {
    searchString:string;
  }
  interface SearchbarProps {

    // act: (searchString: string) => void;
    act:any;
    target?: string;
    className?: string;
  }
  
class SearchBar extends React.Component<SearchbarProps, SearchbarState> {
    onSubmit: React.MouseEventHandler<HTMLButtonElement> | undefined;
    constructor(props:SearchbarProps) {
        super(props);
        this.state = {
            searchString: '' // search query string
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchClick = this.searchClick.bind(this);
    }

    /* Function called 
        When enter key is pressed , search the solr 
    */
    handleKeyPress(event:React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === "Enter"){
            this.props.act(this.state.searchString);
        }
    }

    /* Update the search String when user types */
    
    handleChange(event:React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            searchString: event.target.value
        });
    }

    /* Function called 
        When btn is clicked , search the solr 
    */
    searchClick(){
        this.props.act(this.state.searchString);
    }

    render() {
        return (
            <div>
                <Container id="Search-container" >
                 <input type='text' onChange={this.handleChange} className="search" onKeyPress={this.handleKeyPress} value={this.state.searchString} placeholder="Search.." autoFocus/>
                <Icon  onClick={() => this.searchClick()}/>
                 <Button className="primary" onClick={this.onSubmit} >Search</Button>
                      {/* <Button className="primary">Search</Button> */}
                     <Helpbar/>
                <Button className="my-epc" primary>MYEPC</Button>
                <Result/>
            </Container>
            </div>
            
        );
    }
}

export default SearchBar;