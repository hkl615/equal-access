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

import { IIssue } from "../interfaces/interfaces";

export default class DomPathUtils {
    public static domPathsToElements(xpaths: string[]) {
        // console.log("Function: domPathsToElements: ")
        let results: HTMLElement[] = [];
        xpaths.map((xpath: any) => {
            // console.log("xpath ",index);
            let element;
            // console.log("xpath = ",xpath);
            element = this.domPathToElem(xpath);
            if (element) {
                results.push(element);
            }
        });
        return results;
    }
    
    public static issuesToDomPaths(issues: IIssue[]) {
        // console.log("Inside issuesToDomPaths");
        let tabXpaths: any = [];
        issues.map((result: any) => {
            if (result != null) {
                // console.log("result.path.dom = "+result.path.dom);
                tabXpaths.push(result.path.dom);
            }
        });
        return tabXpaths;
    }

    private static docDomPathToElement(doc: Document | ShadowRoot, domPath:string) : HTMLElement | null {
        if (doc.nodeType === 11) { // document fragment 
            let selector = ":host" + domPath.replace(/\//g, " > ").replace(/\[(\d+)\]/g, ":nth-of-type($1)"); // fixed from original
            let element = doc.querySelector(selector);
            return element as HTMLElement;
        } else { // regular doc type = 9
            let nodes = (doc as Document).evaluate(domPath, doc, null, XPathResult.ANY_TYPE, null);
            let element = nodes.iterateNext();
            if (element) {
                return element as HTMLElement;
            } else {
                return null;
            }
        }
    }

    public static domPathToElem(srcPath: string | null | undefined) {
        let doc : Document | ShadowRoot = document;
        let element = null;
        while (srcPath && (srcPath.includes("iframe") || srcPath.includes("#document-fragment"))) {
            if (srcPath.includes("iframe")) {
                let parts = srcPath.match(/(.*?iframe\[\d+\])(.*)/);
                let iframe = this.docDomPathToElement(doc, parts![1]) as HTMLIFrameElement;
                element = iframe || element;
                if (iframe && iframe.contentDocument) {
                    doc = iframe.contentDocument;
                    srcPath = parts![2];
                } else {
                    srcPath = null;
                }
            } else if (srcPath.includes("#document-fragment")) {
                let parts = srcPath.match(/(.*?)\/#document-fragment\[\d+\](.*)/);
                let fragment = this.docDomPathToElement(doc, parts![1]); // get fragment which is in main document
                element = fragment || element;
                if (fragment && fragment.shadowRoot) {
                    doc = fragment.shadowRoot;
                    srcPath = parts![2];
                } else {
                    srcPath = null;
                }
            } else {
                srcPath = null;
            }
        }
        if (srcPath) {
            element = this.docDomPathToElement(doc, srcPath) || element;
        }
        return element;
    }

    public static getDomPathForElement(element: any) {
        const idx: any = (sib: any, name: any) => sib ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name) : 1;
        const segs: any = (elm: any) => (!elm || elm.nodeType !== 1) ? [''] : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
        return segs(element).join('/');
    }
}