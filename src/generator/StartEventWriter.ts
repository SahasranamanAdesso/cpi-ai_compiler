import { create } from "xmlbuilder2";

/**
 * StartEventWriter - Generates BPMN XML for a Start Event
 *
 * In CPI, every integration flow begins with a Start Event.
 * This writer produces the exact BPMN structure that SAP uses.
 *
 * Example output:
 * <bpmn2:startEvent id="StartEvent_1" name="Start"/>
 *
 * This follows the Single Responsibility Principle - this class knows
 * ONLY how to write Start Event XML, nothing else.
 */
export class StartEventWriter {
    /**
     * Generates the BPMN XML element for a Start Event
     * @returns An XML element representing the start event
     */
    public generate() {
        return create()
            .ele("bpmn2:startEvent", {
                id: "StartEvent_1",
                name: "Start"
            });
    }
}
