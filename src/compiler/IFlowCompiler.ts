import { IFlow } from "../model/IFlow";
import { BpmnProcess } from "../ir/BpmnProcess";

/**
 * IFlowCompiler - Compiles IFlow (SDK model) to BpmnProcess (IR)
 *
 * This is the main compiler that transforms our high-level SDK representation
 * into the BPMN Intermediate Representation.
 *
 * Architecture:
 *
 *   IFlow (SDK)
 *       ↓
 *   IFlowCompiler ← We are here
 *       ↓
 *   BpmnProcess (IR)
 *       ↓
 *   XMLWriter (future)
 *       ↓
 *   .iflw artifact
 *
 * The compiler's job:
 * 1. Take the IFlow model (Components + Connections)
 * 2. Transform Components into BpmnNodes
 * 3. Transform Connections into BpmnSequenceFlows
 * 4. Add Start and End events (every BPMN process needs these)
 * 5. Return a complete BpmnProcess ready for XML serialization
 *
 * Why separate compilation from XML generation?
 * - Testability: Can validate BpmnProcess structure without XML parsing
 * - Flexibility: Same IR can generate XML, diagrams, documentation
 * - Optimization: Can optimize BPMN structure before serialization
 * - Debugging: Can inspect IR before final output
 *
 * Example usage:
 *
 *   const flow = new IFlow("Sales Order Sync");
 *   flow.addComponent(new Component("CMP_1", "Set Headers", "Enricher"));
 *
 *   const compiler = new IFlowCompiler();
 *   const bpmnProcess = compiler.compile(flow);
 *
 *   console.log(bpmnProcess.nodes);
 *   // [
 *   //   BpmnNode("StartEvent_1", "startEvent", "Start"),
 *   //   BpmnNode("CMP_1", "callActivity", "Set Headers", {...}),
 *   //   BpmnNode("EndEvent_1", "endEvent", "End")
 *   // ]
 *
 *   console.log(bpmnProcess.flows);
 *   // [
 *   //   BpmnSequenceFlow("StartEvent_1", "CMP_1"),
 *   //   BpmnSequenceFlow("CMP_1", "EndEvent_1")
 *   // ]
 */
export class IFlowCompiler {

    /**
     * Compiles an IFlow to a BpmnProcess
     *
     * This is the main entry point for compilation. It transforms the
     * high-level SDK model into BPMN Intermediate Representation.
     *
     * The compiled BpmnProcess contains:
     * - All BPMN nodes (start event, components as BPMN elements, end event)
     * - All sequence flows connecting the nodes
     *
     * @param flow - The IFlow to compile
     * @returns BpmnProcess ready for XML serialization
     *
     * @example
     * const flow = new IFlow("Test");
     * const compiler = new IFlowCompiler();
     * const process = compiler.compile(flow);
     */
    compile(flow: IFlow): BpmnProcess {

        const process = new BpmnProcess();

        // We'll populate this in the next step
        // For now, just return an empty process

        return process;
    }

}
