import React from 'react';
import {browserHistory} from 'react-router';

export default class SearchForm extends React.Component {

    constructor (props) {
        super(props);
        this.crawlUrl = this.crawlUrl.bind(this);
    }

    crawlUrl() {
        browserHistory.push('/visualization');
    }

    render () {
        return (
            <div className="Crawl-form">
                <h3>Crawling Form</h3>
                <br/>
                URL to Crawl: <input type='text' id="url"/>
                <br/><br/>
                <input type='radio' name='search-type' value='depth'/> Depth-First
                &emsp;
                <input type='radio' name='search-type' value='breadth'/> Breadth-First
                <br/><br/>
                Crawl Depth: <input type='number' id='depth'/>
                <br/><br/>
                Keyword to Halt (optional): <input type='text' id="url"/>
                <br/><br/>
                <button className="Submit-button" onClick={this.crawlUrl}>Submit</button>
            </div>
        );
    }
}