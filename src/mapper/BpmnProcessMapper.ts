import { IFlow } from "../model/IFlow";
import { BpmnProcess } from "../ir/BpmnProcess";
import { BpmnSequenceFlow } from "../ir/BpmnSequenceFlow";
import { ComponentMapper } from "./ComponentMapper";

/**
 * BpmnProcessMapper - Maps entire IFlow to complete BpmnProcess
 *
 * This completes the FRONT-END of our compiler:
 *
 *   IFlow (Domain Model - entire flow)
 *          ↓
 *   BpmnProcessMapper ← We are here
 *          ↓
 *   ComponentMapper (for each component)
 *          ↓
 *   BpmnProcess (IR - complete process)
 *
 * Responsibilities:
 * - Map IFlow → BpmnProcess
 * - Use ComponentMapper for each component
 * - Transform connections → sequence flows ✅
 * - Add start/end events (future)
 *
 * This is the orchestrator that uses ComponentMapper to build
 * the complete BPMN process structure.
 *
 * Example:
 *   IFlow with 3 components
 *        ↓
 *   BpmnProcessMapper
 *        ↓
 *   BpmnProcess with 3 BpmnNodes
 */
export class BpmnProcessMapper {

    private readonly componentMapper: ComponentMapper;

    constructor() {
        this.componentMapper = new ComponentMapper();
    }

    /**
     * Maps an entire IFlow to a BpmnProcess
     *
     * This is the main entry point for the mapper layer.
     * It orchestrates the complete transformation from domain model to IR.
     *
     * Current implementation:
     * - Maps all components using ComponentMapper
     * - Maps all connections to BPMN sequence flows
     *
     * Future enhancements:
     * - Add start/end events
     * - Add participants for adapters
     * - Generate message flows
     *
     * @param flow - The IFlow to map
     * @returns Complete BpmnProcess ready for XML serialization
     *
     * @example
     * const flow = new IFlow("Sales Order Sync");
     * flow.addComponent(new Component("CMP_1", "Set Headers", "Enricher"));
     *
     * const mapper = new BpmnProcessMapper();
     * const process = mapper.map(flow);
     * // → BpmnProcess with all nodes mapped
     */
    public map(flow: IFlow): BpmnProcess {

        const process = new BpmnProcess("Process_1", "Integration Process");

        // Map all components to BPMN nodes
        const components = flow.getComponents();
        const nodes = this.componentMapper.mapAll(components);

        // Add nodes to process
        nodes.forEach(node => {
            process.nodes.push(node);
        });

        // Map connections to sequence flows
        const connections = flow.getConnections();
        connections.forEach((connection, index) => {
            process.flows.push(
                new BpmnSequenceFlow(
                    `SequenceFlow_${index + 1}`,
                    connection.from.id,
                    connection.to.id
                )
            );
        });

        // TODO: Add start/end events
        // TODO: Add participants for adapters

        return process;
    }

}
