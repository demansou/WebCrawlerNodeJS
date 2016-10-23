import React, {Component, PropTypes} from 'react';

export default class VisualizationPanel extends Component {
    static propTypes = {
        nodes: PropTypes.arrayOf(PropTypes.object).isRequired
    }

    shortenString(curString, context, rectWidth) {
        const spaceForText = rectWidth - 8;
        let curText = (curString.substr(0, 1));
        let text = context.measureText(curText);
        let curLength = 1;

        while ((text.width < spaceForText) && (curText.length < curString.length)) {
            curLength ++;
            curText = (curString.substr(0, curLength));

            text = context.measureText(curText);
        }
        if (curString.length > curText.length) {
            curText = (curString.substr(0, (curLength - 1)) + '...');
        }

        return curText;
    }

    positionNode(context, curNode, curNodeXPos, curNodeYPos, rectWidth, rectHeight) {
        context.fillStyle = '#ADD8E6';
        context.fillRect(curNodeXPos, curNodeYPos, rectWidth, rectHeight);

        context.fillStyle = '#000000';
        context.font = "12px serif";

        let curString = curNode.title;
        curString = this.shortenString(curString, context, rectWidth);

        let curStringLen = context.measureText(curString).width;
        let curStringX;

        if (curStringLen < rectWidth) {
            curStringX = (curNodeXPos + (rectWidth / 2) - (curStringLen / 2));
        } else {
            curStringX = curNodeXPos;
        }

        context.fillText(curString, curStringX, (curNodeYPos + rectHeight / 2));
    }

    findStartingPoint(curAngle, curX, curY, rectHeight) {
        let perimeter = rectHeight * 4;
        let distanceToMove = ((perimeter * curAngle) / 360);
        let startX = curX;
        let startY = curY;
        let halfHeight = rectHeight / 2;

        if (distanceToMove <= halfHeight) {
            startY += distanceToMove;
        } else if ((distanceToMove > halfHeight) && (distanceToMove <= (halfHeight * 3))) {
            startY += halfHeight;
            startX -= (distanceToMove - halfHeight)
        } else if ((distanceToMove > (halfHeight * 3)) && (distanceToMove <= (halfHeight * 5))) {
            startX -= (halfHeight * 2);
            startY += halfHeight;
            startY -= (distanceToMove - (halfHeight * 3));
        } else {
            startY -= halfHeight;
            startX -= (halfHeight * 2);
            startX += (distanceToMove - (halfHeight * 5));
        }

        return {
            startX: startX, 
            startY: startY
        };
    }

    findEndingPoint(px, py, curAngle, rectHeight) {
        let endX = px;
        let endY = py;
        let halfHeight = rectHeight / 2;
        
        if((curAngle >= 315 && curAngle < 360) || ((curAngle >= 0) && (curAngle < 45))) {
            endY += halfHeight;
        } else if ((curAngle >= 45) && (curAngle < 135)) {
            endX += halfHeight;
        } else if ((curAngle >= 135) && (curAngle < 225)) {
            endX += rectHeight;
            endY += halfHeight;
        } else {
            endY += rectHeight;
            endX += halfHeight;
        }

        return {endX, endY};
    }

    componentDidMount() {
        let that = this;
        
        const canvasWidth = 900;
        const canvasHeight = 600;
        const rectWidth = 100;
        const rectHeight = 100;
        const nextRoundMargin = 200;
        
        let canvas = document.getElementById("crawlVisualization");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        let context = canvas.getContext("2d");

        let curNode = this.props.nodes.find(e => e.parent === null);

        let curXPos = (canvasWidth / 2 - rectWidth / 2);
        let curYPos = (canvasHeight / 2 - rectHeight / 2);

        this.positionNode(context, curNode, curXPos, curYPos, rectWidth, rectHeight);

        let curRound = this.props.nodes.filter(
            function(e) {
                    return e.parent && (e.parent.url === curNode.url);
            });

        //Source for finding point on a circle given division of circle into segments.
        //http://math.stackexchange.com/questions/805906/find-points-on-a-circle-given-arc-length-and-radius
        
        //curRound.forEach(e => console.log(e));
        let s = (2 * Math.PI * nextRoundMargin) / curRound.length;
        let angle = s / nextRoundMargin;
        let curAngle = 0;

        curRound.forEach(function(e, index){
            let px = curXPos + nextRoundMargin * Math.cos(curAngle);
            let py = curYPos + nextRoundMargin * Math.sin(curAngle);
            let lineStartX = curXPos + rectWidth;
            let lineStartY = curYPos + rectHeight / 2;
            let curAngleDeg = curAngle * (180 / Math.PI);

            that.positionNode(context, e, px, py, rectWidth, rectHeight);

            let {startX, startY} = that.findStartingPoint(curAngleDeg, lineStartX, lineStartY, rectHeight);
            let {endX, endY} = that.findEndingPoint(px, py, curAngleDeg, rectHeight);
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();

            curAngle += angle;
        });

        canvas.style.display = 'block';
    }
   
    render () {
        //console.log(this.props.nodes);

        return (
            <canvas id='crawlVisualization'></canvas>  
        );
    }
}