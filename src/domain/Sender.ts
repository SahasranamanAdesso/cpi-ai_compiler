/**
 * Sender - Represents a Sender adapter in an integration flow
 *
 * This is a domain concept that CPI developers understand.
 * When you drag a "Sender" onto the CPI canvas, this is what you're creating.
 *
 * Examples:
 *   - HTTPS Sender
 *   - SOAP Sender
 *   - OData Sender
 *   - SFTP Sender
 *   - JMS Sender
 */
export class Sender {
    /**
     * Creates a new Sender
     * @param adapter - The protocol/adapter type (e.g., "HTTPS", "SOAP", "OData")
     * @param name - Optional human-readable name for this sender
     */
    constructor(
        public readonly adapter: string,
        public readonly name?: string
    ) {}
}
