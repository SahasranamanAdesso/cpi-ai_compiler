import { create } from "xmlbuilder2";

/**
 * EndEventWriter - Generates BPMN XML for an End Event
 *
 * In CPI, every integration flow ends with an End Event.
 * This writer produces the exact BPMN structure that SAP uses.
 *
 * Example output:
 * <bpmn2:endEvent id="EndEvent_1" name="End"/>
 *
 * This follows the Single Responsibility Principle - this class knows
 * ONLY how to write End Event XML, nothing else.
 */
export class EndEventWriter {
    /**
     * Generates the BPMN XML element for an End Event
     * @returns An XML element representing the end event
     */
    public generate() {
        return create()
            .ele("bpmn2:endEvent", {
                id: "EndEvent_1",
                name: "End"
            });
    }
}
