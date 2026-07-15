import { BpmnCollaboration } from "./BpmnCollaboration";
import { BpmnProcess } from "./BpmnProcess";

/**
 * BpmnDefinitions - Root BPMN element
 */
export class BpmnDefinitions {
    public readonly namespaces: Map<string, string>;

    constructor(
        public readonly id: string,
        public readonly collaboration: BpmnCollaboration,
        public readonly process: BpmnProcess
    ) {
        // Standard BPMN + SAP namespaces from reference artifact
        this.namespaces = new Map([
            ['bpmn2', 'http://www.omg.org/spec/BPMN/20100524/MODEL'],
            ['bpmndi', 'http://www.omg.org/spec/BPMN/20100524/DI'],
            ['dc', 'http://www.omg.org/spec/DD/20100524/DC'],
            ['di', 'http://www.omg.org/spec/DD/20100524/DI'],
            ['ifl', 'http:///com.sap.ifl.model/Ifl.xsd'],
            ['xsi', 'http://www.w3.org/2001/XMLSchema-instance']
        ]);
    }
}
