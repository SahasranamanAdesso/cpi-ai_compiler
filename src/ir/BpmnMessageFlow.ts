import { IflProperty } from "./IflProperty";

/**
 * BpmnMessageFlow - BPMN Message Flow (Adapter connections)
 */
export class BpmnMessageFlow {
    public readonly properties: IflProperty[] = [];

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly sourceRef: string,
        public readonly targetRef: string
    ) {}

    addProperty(key: string, value: string): void {
        this.properties.push(new IflProperty(key, value));
    }
}
