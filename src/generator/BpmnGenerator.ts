import { create } from "xmlbuilder2";
import { IFlow } from "../model/IFlow";
import { StartEventWriter } from "./StartEventWriter";
import { EndEventWriter } from "./EndEventWriter";

/**
 * BpmnGenerator - Orchestrates the generation of BPMN 2.0 XML from an IFlow
 *
 * This is the compiler's core orchestrator. It delegates to specialized Writer
 * classes following the Single Responsibility Principle:
 *
 * BpmnGenerator (orchestrator)
 *   ├── StartEventWriter
 *   ├── EndEventWriter
 *   ├── ParticipantWriter (coming soon)
 *   ├── CallActivityWriter (coming soon)
 *   └── SequenceFlowWriter (coming soon)
 *
 * Each writer knows how to generate XML for ONE specific BPMN element.
 * This keeps the codebase modular, testable, and maintainable.
 *
 * Architecture:
 *   IFlow (model) → BpmnGenerator → Writers → BPMN XML
 */
export class BpmnGenerator {
    private startEventWriter = new StartEventWriter();
    private endEventWriter = new EndEventWriter();

    /**
     * Generates BPMN 2.0 XML from an IFlow object
     * @param flow - The integration flow to convert to XML
     * @returns A string containing valid BPMN 2.0 XML
     */
    public generate(flow: IFlow): string {
        // Create the root BPMN definitions element
        const root = create({ version: "1.0", encoding: "UTF-8" })
            .ele("bpmn2:definitions", {
                "xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL"
            });

        // Add the process element (represents the Integration Process in CPI)
        const process = root.ele("bpmn2:process", {
            id: flow.name
        });

        // Delegate to specialized writers to add BPMN elements
        // Every integration flow has a Start Event
        process.import(this.startEventWriter.generate());

        // Every integration flow has an End Event
        process.import(this.endEventWriter.generate());

        // Convert to formatted XML string
        return root.end({ prettyPrint: true });
    }
}

