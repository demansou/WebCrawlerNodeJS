import React, {Component} from 'react';
import {tempData} from './TempData';
import VisualizationPanel from './VisualizationPanel';

export default class Visualization extends Component { 
    render () {
        const crawlResults = tempData.packets;
        //console.log(crawlResults);
        //let visualContent = null;
        // let curChildrenList;

        // visualContent = crawlResults.map(function(packet, index) {
        //     curChildrenList = packet.children.map(function(child, index) {
        //         return(<li key={index}>{child}</li>);
        //     })

        //     return (
        //         <li key={index}><h3>{packet.title} | {packet.url}</h3>
        //             <ul style={{listStyleType:'circle'}}>{curChildrenList}</ul>
        //         </li>
        //     );
        // })

        //for return: <ul style={{overflowWrap: 'break-word'}}>{visualContent}</ul>

        return (
        <div className="Visualization">
            <VisualizationPanel nodes={crawlResults}/>
        </div>
        );
    }
}