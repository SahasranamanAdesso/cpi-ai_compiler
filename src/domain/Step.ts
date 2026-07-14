/**
 * Step - Abstract base class for all integration process steps
 *
 * In CPI, an Integration Process contains a sequence of Steps.
 * Each step performs a specific transformation or action on the message.
 *
 * Concrete step types:
 *   - ContentModifier (set headers, properties, body)
 *   - Router (conditional routing)
 *   - GroovyScript (custom logic)
 *   - DataStore (persist/retrieve data)
 *   - RequestReply (call external system)
 *   - MessageMapping (transform message structure)
 *   - XMLValidator
 *   - JSONToXML / XMLToJSON
 *   - Encryptor / Decryptor
 *   - etc.
 *
 * This is an abstract class - use specific step types instead.
 */
export abstract class Step {
    /**
     * Creates a new Step
     * @param name - Human-readable name for this step
     */
    constructor(
        public readonly name: string
    ) {}
}
