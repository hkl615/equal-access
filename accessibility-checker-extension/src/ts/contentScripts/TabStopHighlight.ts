/******************************************************************************
  Copyright:: 2020- IBM, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*****************************************************************************/

import { getBGController } from "../background/backgroundController";
import { getDevtoolsController } from "../devtools/devtoolsController";
import DomPathUtils from "./DomPathUtils";
import { 
    IIssue, 
    IReport 
} from "../interfaces/interfaces";

export default class TabStopHighlight {
    // JCH - This is where we handle Tab Stop highlighting
    //       Since there are no more Triangles there will be no polygons
    //       So we need to differentiate between regular circles and circles with errors.
    //       The number text inside the circle (doesn't matter if error or not) 
    //       will be normal if not highlighting, bold if highlight
    public static async handleTabHighlight(event:any,doc:any,docType:string,iframeStr:string, tabStopsErrors: IReport, regularTabstops: IReport) { // doc type is main, iframe, shadowdom, click
        let elementXpath = "";
        if (!event.shiftKey && event.key === "Tab") { // only catch Tab key
            // console.log("Got TAB Key");
            // console.log("TAB doc = ", doc);
            if (docType === "main") {
                let element = doc.activeElement;  // get element just tabbed to which has focus
                elementXpath = DomPathUtils.getDomPathForElement(element); // in main doc so just get xpath
            }
            
            // if we have iframe
            if (docType === "iframe") {
                // console.log("Got iframe element");
                let element = doc.activeElement;  // get element just tabbed to which has focus
                elementXpath = DomPathUtils.getDomPathForElement(element); // in main doc so just get xpath
                elementXpath = iframeStr + elementXpath;
            }

            // if we have shadow dom no need to do anything special
            if (docType === "shadowdom") {
                // console.log("we have an element in a shadow dom");
                let sdXpath = DomPathUtils.getDomPathForElement(doc);
                let element = doc.shadowRoot.activeElement;
                elementXpath = DomPathUtils.getDomPathForElement(element);
                // need #document-fragment[n]
                elementXpath = sdXpath+iframeStr;
            }

            // get circle or errorCircle with matching xpath
            let circle = document.querySelector('circle[xpath="'+elementXpath+'"]');
            // console.log("circle test = ", circle);
            let errorCircle = null;
            if (circle?.classList.contains('error')) {
                errorCircle = document.querySelector('circle[xpath="'+elementXpath+'"]');
            }
            
            let prevHighlightedElement;
            // find previous highlighted element which is either a circle or errorCircle so will be within document
            if (prevHighlightedElement = document.getElementsByClassName("highlightSVGcircle")[0]) {
                // console.log("Found prevHighlightedElement is circle = ", prevHighlightedElement);
            } else if (prevHighlightedElement = document.getElementsByClassName("highlightSVGerrorCircle")[0]) {
                // console.log("Found prevHighlightedElement is errorCircle = ", prevHighlightedElement );
            }
            // for prevHighlightedElement remove highlightSVGcircle and add nohighlightSVGcircle
            if (prevHighlightedElement) {
                // console.log("prevHighlightedElement.tagName = ", prevHighlightedElement.tagName);
                if (prevHighlightedElement.tagName === "circle" && !prevHighlightedElement.classList.contains('error')) {
                    prevHighlightedElement.classList.remove("highlightSVGcircle");
                    prevHighlightedElement.classList.add("nohighlightSVGcircle");
                    let prevHightlightedText = this.findCircleTextElement(prevHighlightedElement);
                    prevHightlightedText?.classList.remove("highlightSVGText");
                    prevHightlightedText?.classList.add("noHighlightSVGText");
                } 
                else if (prevHighlightedElement.tagName === "circle" && prevHighlightedElement.classList.contains('error')) {
                    prevHighlightedElement.classList.remove("highlightSVGerrorCircle");
                    prevHighlightedElement.classList.add("nohighlightSVGerrorCircle");
                    let prevHightlightedText = this.findCircleTextElement(prevHighlightedElement);
                    prevHightlightedText?.classList.remove("highlightSVGText");
                    prevHightlightedText?.classList.add("noHighlightSVGText");
                }
                // console.log("prevHighlightedElement unhighlighted = ",prevHighlightedElement);
            } else {
                // console.log("No prevHighlightedElement to highlight")
            }
            // Highlight circle
            if (circle && !circle.classList.contains('error')) {
                circle?.classList.remove("nohighlightSVGcircle");
                circle?.classList.add("highlightSVGcircle");
                let circleText = this.findCircleTextElement(circle);
                circleText?.classList.remove("noHighlightSVGText");
                circleText?.classList.add("highlightSVGText");
                // console.log("circle highlighted = ",circle);
                // console.log("circleText highlighted = ", circleText);
            } else {
                // console.log("No circle to highlight = ",circle);
            }
            if (errorCircle && errorCircle.classList.contains('error')) {
                errorCircle?.classList.remove("nohighlightSVGerrorCircle");
                errorCircle?.classList.add("highlightSVGerrorCircle");
                let errorCircleText = this.findErrorCircleTextElement(errorCircle);
                errorCircleText?.classList.remove("noHighlightSVGText");
                errorCircleText?.classList.add("highlightSVGText");
                // console.log("errorCircle highlighted = ",errorCircle);
            } else {
                // console.log("No errorCircle to highlight = ",errorCircle);
            }
        } else if (event.shiftKey && event.key === "Tab") { // catch SHIFT TAB
            // console.log("Got SHIFT TAB Key");
            // console.log("TAB doc = ", doc);
            if (docType === "main") {
                // console.log("Got main doc element");
                let element = doc.activeElement;  // get element just tabbed to which has focus
                elementXpath = DomPathUtils.getDomPathForElement(element); // in main doc so just get xpath
            }
            
            // if we have iframe
            if (docType === "iframe") {
                // console.log("Got iframe element");
                let element = doc.activeElement;  // get element just tabbed to which has focus
                elementXpath = DomPathUtils.getDomPathForElement(element); // in main doc so just get xpath
                elementXpath = iframeStr + elementXpath;
            }

            // if we have shadow dom no need to do anything special
            if (docType === "shadowdom") {
                // console.log("Got shadow dom element");
                let sdXpath = DomPathUtils.getDomPathForElement(doc);
                let element = doc.shadowRoot.activeElement;
                elementXpath = DomPathUtils.getDomPathForElement(element);
                // need #document-fragment[n]
                elementXpath = sdXpath+iframeStr;
            }

            // get circle or errorCircle with matching xpath
            let circle = document.querySelector('circle[xpath="'+elementXpath+'"]');
            let errorCircle = null;
            if (circle?.classList.contains('error')) {
                errorCircle = document.querySelector('circle[xpath="'+elementXpath+'"]');
            }
            
            let prevHighlightedElement;
            // find previouse highlighted element which is either a circle or triangle so will be within document
            
            if (prevHighlightedElement = document.getElementsByClassName("highlightSVGcircle")[0]) {
                // console.log("Found prevHighlightedElement is circle = ", prevHighlightedElement);
            } else if (prevHighlightedElement = document.getElementsByClassName("highlightSVGerrorCircle")[0]) {
                // console.log("Found prevHighlightedElement is errorCircle = ", prevHighlightedElement );
            }
            // for prevHighlightedElement remove highlightSVGcircle and add nohighlightSVGcircle
            
            if (prevHighlightedElement) {
                // console.log("prevHighlightedElement.tagName = ", prevHighlightedElement.tagName);
                if (prevHighlightedElement.tagName === "circle" && !prevHighlightedElement.classList.contains('error')) {
                    prevHighlightedElement.classList.remove("highlightSVGcircle");
                    prevHighlightedElement.classList.add("nohighlightSVGcircle");
                    let prevHightlightedText = this.findCircleTextElement(prevHighlightedElement);
                    prevHightlightedText?.classList.remove("highlightSVGText");
                    prevHightlightedText?.classList.add("noHighlightSVGText");
                } 
                else if (prevHighlightedElement.tagName === "circle" && prevHighlightedElement.classList.contains('error')) {
                    prevHighlightedElement.classList.remove("highlightSVGerrorCircle");
                    prevHighlightedElement.classList.add("nohighlightSVGerrorCircle");
                    let prevHightlightedText = this.findCircleTextElement(prevHighlightedElement);
                    prevHightlightedText?.classList.remove("highlightSVGText");
                    prevHightlightedText?.classList.add("noHighlightSVGText");
                }
                // console.log("prevHighlightedElement unhighlighted = ",prevHighlightedElement);
            } else {
                // console.log("No prevHighlightedElement to highlight")
            }
            // Highlight circle
            if (circle && !circle.classList.contains('error')) {
                circle?.classList.remove("nohighlightSVGcircle");
                circle?.classList.add("highlightSVGcircle");
                let circleText = this.findCircleTextElement(circle);
                circleText?.classList.remove("noHighlightSVGText");
                circleText?.classList.add("highlightSVGText");
                // console.log("circle highlighted = ",circle);
            } else {
                // console.log("No circle to highlight = ",circle);
            }
            if (errorCircle && errorCircle.classList.contains('error')) {
                errorCircle?.classList.remove("nohighlightSVGerrorCircle");
                errorCircle?.classList.add("highlightSVGerrorCircle");
                let errorCircleText = this.findErrorCircleTextElement(errorCircle);
                errorCircleText?.classList.remove("noHighlightSVGText");
                errorCircleText?.classList.add("highlightSVGText");
                // console.log("errorCircle highlighted = ",errorCircle);
            } else {
                // console.log("No errorCircle to highlight = ",circle);
            }
        } else if (event.detail !== 0) {
            // console.log("We got a mouse click on a circle");
            if (event.target.tagName === "circle" && !event.target.classList.contains('error') || event.target.tagName === "circle" && event.target.classList.contains('error')) {
                let circle = null;
                if (event.target.tagName === "circle" && !event.target.classList.contains('error')) {
                    circle = event.target;
                }
                let errorCircle = null;
                if (event.target.tagName === "circle" && event.target.classList.contains('error')) {
                    errorCircle = event.target;
                }

                let element = DomPathUtils.domPathToElem(event.target.getAttribute("xpath")); // circle's element that we want to have focus

                elementXpath = DomPathUtils.getDomPathForElement(element); // path if not in iframe
                
                // if we have iframe
                if (docType === "iframe") {
                    element = doc.activeElement;  // get element just tabbed to which has focus
                    elementXpath = DomPathUtils.getDomPathForElement(element); // in main doc so just get xpath
                    elementXpath = iframeStr + elementXpath;
                    // console.log("iframeStr = ",iframeStr)
                }

                
                // get circle or polygon with matching xpath
                // let circle = document.querySelector('circle[xpath="'+elementXpath+'"]');
                // let polygon = document.querySelector('polygon[xpath="'+elementXpath+'"]');
                let prevHighlightedElement;
                if (prevHighlightedElement = doc.getElementsByClassName("highlightSVGcircle")[0] || document.getElementsByClassName("highlightSVGcircle")[0]) {
                    // console.log("Found prevHighlightedElement is circle = ", prevHighlightedElement);
                } else if (prevHighlightedElement = doc.getElementsByClassName("highlightSVGerrorCircle")[0] || document.getElementsByClassName("highlightSVGerrorCircle")[0]) {
                    // console.log("Found prevHighlightedElement is errorCircle = ", prevHighlightedElement );
                }
                // for prevHighlightedElement remove highlightSVGcircle and add nohighlightSVGcircle
                
                if (prevHighlightedElement) {
                    // console.log("prevHighlightedElement.tagName = ", prevHighlightedElement.tagName);
                    if (prevHighlightedElement.tagName === "circle" && !prevHighlightedElement.classList.contains('error')) {
                        prevHighlightedElement.classList.remove("highlightSVGcircle");
                        prevHighlightedElement.classList.add("nohighlightSVGcircle");
                        let prevHightlightedText = this.findCircleTextElement(prevHighlightedElement);
                        prevHightlightedText?.classList.remove("highlightSVGText");
                        prevHightlightedText?.classList.add("noHighlightSVGText");
                    } 
                    else if (prevHighlightedElement.tagName === "circle" && prevHighlightedElement.classList.contains('error')) {
                        prevHighlightedElement.classList.remove("highlightSVGerrorCircle");
                        prevHighlightedElement.classList.add("nohighlightSVGerrorCircle");
                        let prevHightlightedText = this.findCircleTextElement(prevHighlightedElement);
                        prevHightlightedText?.classList.remove("highlightSVGText");
                        prevHightlightedText?.classList.add("noHighlightSVGText");
                    }
                    // console.log("prevHighlightedElement unhighlighted = ",prevHighlightedElement);
                } else {
                    console.log("No prevHighlightedElement to highlight")
                }
                // Highlight circle
                if (circle && !circle.classList.contains('error')) {
                    circle?.classList.remove("nohighlightSVGcircle");
                    circle?.classList.add("highlightSVGcircle");
                    let circleText = this.findCircleTextElement(circle);
                    circleText?.classList.remove("noHighlightSVGText");
                    circleText?.classList.add("highlightSVGText");
                    // console.log("circle highlighted = ",circle);
                    // console.log("Highlight Regular Circle, elementXpath = ", elementXpath);

                    let issue = this.getIssueByXpath(elementXpath,regularTabstops);
                    // console.log("issue = ", issue);

                    let tabId = await getBGController().getTabId();
                    let devtoolsController = getDevtoolsController(true, "remote", tabId);
                    await devtoolsController.setSelectedIssue(null);
                    if (await devtoolsController.getActivePanel() === "elements") {
                        await devtoolsController.inspectPath(elementXpath,element);
                    } else {
                        await devtoolsController.setSelectedElementPath(issue.path.dom);
                    }
                } else {
                    console.log("No circle to highlight = ",circle);
                }
                // Highlight error circle
                if (errorCircle && errorCircle.classList.contains('error')) {
                    errorCircle?.classList.remove("nohighlightSVGerrorCircle");
                    errorCircle?.classList.add("highlightSVGerrorCircle");
                    let errorCircleText = this.findErrorCircleTextElement(errorCircle);
                    errorCircleText?.classList.remove("noHighlightSVGText");
                    errorCircleText?.classList.add("highlightSVGText");
                    // console.log("errorCircle highlighted = ",errorCircle);
                    // console.log("Highlight Error Circle, elementXpath = ",elementXpath, "   element = ",element);

                    let issue = this.getIssueByXpath(elementXpath,tabStopsErrors);
                    // console.log("issue = ", issue);

                    let tabId = await getBGController().getTabId();
                    let devtoolsController = getDevtoolsController(true, "remote", tabId);
                    await devtoolsController.setSelectedIssue(issue);
                    if (await devtoolsController.getActivePanel() === "elements") {
                        await devtoolsController.inspectPath(elementXpath,element);
                    } else {
                        await devtoolsController.setSelectedElementPath(issue.path.dom);
                    }
                } else {
                    console.log("No errorCircle to highlight = ",circle);
                }
                // element.focus(); // Can't focus going to Scan Button 
            }
        }
    }

    private static findCircleTextElement(circle:any) {
        
        let circleClassList, circleClassMatch, circleNumber, textCollection;
    
        if (circle) {
            circleClassList = circle?.classList.value.toLowerCase().split(' ');
            circleClassMatch = circleClassList.filter((item: string) => {return item.toLowerCase().includes('circleNumber'.toLowerCase())});
            circleNumber = circleClassMatch[0].slice(12);
            textCollection = document.getElementsByClassName("circleNumber" + circleNumber + " circleText");
            // console.log("textCollection.length = ", textCollection.length);
            // console.log("circleCollection[0] = ", textCollection[0]);
            return (textCollection[0]);
        } else {
            return null;
        } 
    }

    private static findErrorCircleTextElement(errorCircle:any) {
        let errorCircleClasslist, errorCircleClassMatch, errorCircleNumber, errorTextCollection;
    
        if (errorCircle) {
            errorCircleClasslist = errorCircle?.classList.value.split(' ');
            // @ts-ignore
            errorCircleClassMatch = errorCircleClasslist.filter((item: string) => {return item.toLowerCase().includes('circleNumber'.toLowerCase())});
            errorCircleNumber = errorCircleClassMatch[0].slice(12);
            // console.log("errorCircleNumber = ", errorCircleNumber);
            errorTextCollection = document.getElementsByClassName("circleNumber" + errorCircleNumber + " circleText");
            // console.log("textCollection.length = ", errorTextCollection.length);
            // console.log("circleCollection[0] = ", errorTextCollection[0]);
            return (errorTextCollection[0]);
        } else {
            return null;
        }
    }

    private static getIssueByXpath(elementXpath:string, tabStopsErrors: IReport) {
        let issue: any;
        let tabStops:any = tabStopsErrors;
        for (let i = 0; i < tabStops.length; i++) {
            if (tabStops[i].path.dom === elementXpath) {
                issue = tabStops[i];
            }
        }
        return issue as IIssue;
    }
}