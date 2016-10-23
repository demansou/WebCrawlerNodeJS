import React from 'react'
import homeIcon from './img/ic_home_black_24px.svg';
import webLogo from './img/web.png';
import {Link} from 'react-router';

export default class Header extends React.Component {
    render () {
        return (
            <div className="App-header">
                <div className="Title-and-Logo">
                    <Link to="/"><img className="Logo" src={webLogo} alt="logo"/></Link>
                    <h2><Link id="App-title" to="/">Graphical Crawler</Link></h2>
                </div>
                <Link to="/"><img src={homeIcon} alt="home"/></Link>
            </div>
        );
    }
}