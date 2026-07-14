/**
 * Receiver - Represents a Receiver adapter in an integration flow
 *
 * This is a domain concept that CPI developers understand.
 * When you drag a "Receiver" onto the CPI canvas, this is what you're creating.
 *
 * Examples:
 *   - HTTPS Receiver
 *   - SOAP Receiver
 *   - OData Receiver
 *   - SFTP Receiver
 *   - SuccessFactors Receiver
 */
export class Receiver {
    /**
     * Creates a new Receiver
     * @param adapter - The protocol/adapter type (e.g., "HTTPS", "SOAP", "OData")
     * @param name - Optional human-readable name for this receiver
     */
    constructor(
        public readonly adapter: string,
        public readonly name?: string
    ) {}
}
