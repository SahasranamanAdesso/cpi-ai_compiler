import { Step } from "./Step";

/**
 * IntegrationProcess - Represents the main processing pipeline in an iFlow
 *
 * This is what you see in the middle of the CPI designer canvas.
 * It contains a sequence of Steps that process the message from
 * Sender to Receiver.
 *
 * Example flow:
 *   Sender → Start → ContentModifier → Router → DataStore → End → Receiver
 *
 * The IntegrationProcess contains:
 *   [ContentModifier, Router, DataStore]
 */
export class IntegrationProcess {
    private readonly steps: Step[] = [];

    /**
     * Creates a new Integration Process
     * @param name - Optional name for this process
     */
    constructor(public readonly name?: string) {}

    /**
     * Adds a step to the integration process
     * @param step - The step to add
     * @returns this for fluent API chaining
     */
    public addStep(step: Step): IntegrationProcess {
        this.steps.push(step);
        return this;
    }

    /**
     * Gets all steps in this process
     * @returns Array of steps
     */
    public getSteps(): Step[] {
        return this.steps;
    }
}
