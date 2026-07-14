/**
 * Connection - Represents a flow connection between components
 *
 * In the CPI designer, these are the arrows connecting components.
 *
 * Unlike BPMN's low-level sequenceFlow concept, this is a high-level
 * domain concept that developers think about:
 *   "Connect the Sender to the Content Modifier"
 *   "Connect the Router to the Receiver"
 *
 * The compiler will later translate this into BPMN sequenceFlow elements.
 */
export class Connection {
    /**
     * Creates a new Connection
     * @param from - Source component
     * @param to - Target component
     */
    constructor(
        public readonly from: any,  // Will be typed more specifically later
        public readonly to: any     // Will be typed more specifically later
    ) {}
}
