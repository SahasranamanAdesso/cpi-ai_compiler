import { Sender } from "./Sender";
import { Receiver } from "./Receiver";
import { IntegrationProcess } from "./IntegrationProcess";
import { Step } from "./Step";
import { ContentModifier } from "./ContentModifier";

/**
 * IFlowDefinition - The main SDK API for building integration flows
 *
 * This is what developers and AI interact with. It provides a fluent,
 * CPI-native API for defining integration flows.
 *
 * Example usage:
 *   const flow = new IFlowDefinition("SalesOrderSync")
 *       .sender("HTTPS")
 *       .contentModifier({ headers: { Country: "IN" } })
 *       .receiver("HTTPS");
 *
 * This is NOT the BPMN model - it's a higher-level domain model.
 * The compiler will transform this into BPMN XML.
 *
 * Architecture:
 *   Developer → IFlowDefinition → Compiler → BPMN → .iflw
 */
export class IFlowDefinition {
    private _sender?: Sender;
    private _receiver?: Receiver;
    private _process: IntegrationProcess;

    /**
     * Creates a new IFlow definition
     * @param name - The name of the integration flow
     */
    constructor(public readonly name: string) {
        this._process = new IntegrationProcess();
    }

    /**
     * Adds a Sender to the flow (fluent API)
     * @param adapter - The adapter type (e.g., "HTTPS", "SOAP", "OData")
     * @param name - Optional name for the sender
     * @returns this for method chaining
     */
    public sender(adapter: string, name?: string): IFlowDefinition {
        this._sender = new Sender(adapter, name);
        return this;
    }

    /**
     * Adds a Receiver to the flow (fluent API)
     * @param adapter - The adapter type (e.g., "HTTPS", "SOAP", "OData")
     * @param name - Optional name for the receiver
     * @returns this for method chaining
     */
    public receiver(adapter: string, name?: string): IFlowDefinition {
        this._receiver = new Receiver(adapter, name);
        return this;
    }

    /**
     * Adds a step to the integration process
     * @param step - The step to add
     * @returns this for method chaining
     */
    public addStep(step: Step): IFlowDefinition {
        this._process.addStep(step);
        return this;
    }

    /**
     * Adds a ContentModifier step (convenience method)
     * @param config - Configuration for headers, properties, body
     * @returns this for method chaining
     */
    public contentModifier(config?: {
        headers?: Record<string, string>;
        properties?: Record<string, string>;
        body?: string;
    }): IFlowDefinition {
        const step = new ContentModifier("Content Modifier", config);
        return this.addStep(step);
    }

    /**
     * Gets the sender (if defined)
     */
    public getSender(): Sender | undefined {
        return this._sender;
    }

    /**
     * Gets the receiver (if defined)
     */
    public getReceiver(): Receiver | undefined {
        return this._receiver;
    }

    /**
     * Gets the integration process
     */
    public getProcess(): IntegrationProcess {
        return this._process;
    }
}
