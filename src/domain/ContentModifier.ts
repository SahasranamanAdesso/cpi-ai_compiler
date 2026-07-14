import { Step } from "./Step";

/**
 * ContentModifier - Modifies message headers, properties, or body
 *
 * This is one of the most commonly used steps in CPI.
 * It allows you to:
 *   - Set/modify headers
 *   - Set/modify properties
 *   - Set/modify the message body
 *
 * Example:
 *   new ContentModifier("Set Country", {
 *       headers: {
 *           Country: "IN",
 *           CurrentDate: "${date:now:yyyy-MM-dd}"
 *       }
 *   })
 */
export class ContentModifier extends Step {
    /**
     * Creates a new ContentModifier step
     * @param name - Human-readable name for this step
     * @param config - Configuration for headers, properties, body
     */
    constructor(
        name: string,
        public readonly config?: {
            headers?: Record<string, string>;
            properties?: Record<string, string>;
            body?: string;
        }
    ) {
        super(name);
    }
}
