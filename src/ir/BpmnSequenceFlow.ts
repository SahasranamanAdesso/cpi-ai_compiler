/**
 * BpmnSequenceFlow - Intermediate Representation of a BPMN sequence flow
 *
 * Represents a connection between two BPMN nodes.
 * In XML, this becomes:
 *   <sequenceFlow id="..." sourceRef="StartEvent_1" targetRef="CallActivity_1"/>
 *
 * A sequence flow connects:
 * - sourceRef: ID of the source node
 * - targetRef: ID of the target node
 *
 * Example:
 *   new BpmnSequenceFlow("StartEvent_1", "CallActivity_1")
 *
 * This creates a flow from the start event to a content modifier.
 */
export class BpmnSequenceFlow {
    constructor(
        public readonly id: string,
        public readonly sourceRef: string,
        public readonly targetRef: string
    ) {}
}
