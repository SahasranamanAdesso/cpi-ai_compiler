import { Component } from "../model/Component";
import { IFlow } from "../model/IFlow";
import { CompilerRule, IRNode } from "./CompilerRule";

/**
 * Compiler - Orchestrates the compilation of IFlow to Intermediate Representation
 *
 * The Compiler uses a rule-based architecture where each component type
 * has its own CompilerRule. This makes the compiler extensible:
 * - New component types = new rules, no changes to Compiler
 * - Rules are registered at startup
 * - Compiler delegates to the appropriate rule based on componentType
 *
 * Architecture:
 *
 *   IFlow
 *     │
 *     ▼
 *   Compiler ─────┐
 *     │           │
 *     │           ▼
 *     │      CompilerRule (Strategy)
 *     │           │
 *     │           ├── ContentModifierRule
 *     │           ├── RouterRule
 *     │           ├── GroovyRule
 *     │           └── ...
 *     │
 *     ▼
 *   IRNode[]
 *     │
 *     ▼
 *   XMLWriter (future)
 *     │
 *     ▼
 *   BPMN XML
 *
 * This separation allows us to:
 * 1. Test compilation logic independently of XML generation
 * 2. Generate multiple output formats from the same IR
 * 3. Add new component types without modifying core compiler
 * 4. Validate and optimize at the IR level before serialization
 */
export class Compiler {
    /**
     * Registry of compilation rules
     * Each rule knows how to compile one or more component types
     */
    private readonly rules: CompilerRule[] = [];

    /**
     * Register a compilation rule
     *
     * Rules should be registered during compiler initialization.
     * Multiple rules can be registered, and the first rule that supports
     * a given componentType will be used.
     *
     * @param rule - The compilation rule to register
     * @returns this Compiler instance for method chaining
     *
     * @example
     * const compiler = new Compiler()
     *     .register(new ContentModifierRule())
     *     .register(new RouterRule())
     *     .register(new GroovyRule());
     */
    public register(rule: CompilerRule): Compiler {
        this.rules.push(rule);
        return this;
    }

    /**
     * Compiles an IFlow to its Intermediate Representation
     *
     * This is the main entry point for compilation. It:
     * 1. Iterates over all components in the flow
     * 2. Finds the appropriate rule for each component
     * 3. Compiles each component to IR
     * 4. Returns the complete IR structure
     *
     * @param flow - The IFlow to compile
     * @returns Array of IR nodes representing the flow
     * @throws Error if a component type has no registered rule
     *
     * @example
     * const flow = new IFlow("Sales Order Sync");
     * flow.addComponent(new Component("CMP_1", "Set Headers", "Enricher"));
     *
     * const compiler = new Compiler().register(new ContentModifierRule());
     * const ir = compiler.compile(flow);
     * // ir = [{ element: "callActivity", activityType: "Enricher", ... }]
     */
    public compile(flow: IFlow): IRNode[] {
        const components = flow.getComponents();
        const irNodes: IRNode[] = [];

        for (const component of components) {
            const rule = this.findRule(component.componentType);

            if (!rule) {
                throw new Error(
                    `No compilation rule found for component type: ${component.componentType}\n` +
                    `Component: ${component.name} (${component.id})\n` +
                    `Available rules: ${this.rules.map(r => r.constructor.name).join(", ")}`
                );
            }

            const irNode = rule.compile(component);
            irNodes.push(irNode);
        }

        return irNodes;
    }

    /**
     * Finds the first rule that supports the given component type
     *
     * @param componentType - The component type to find a rule for
     * @returns The matching rule, or undefined if none found
     */
    private findRule(componentType: string): CompilerRule | undefined {
        return this.rules.find(rule => rule.supports(componentType));
    }

    /**
     * Gets all registered rules (useful for debugging and introspection)
     *
     * @returns Array of all registered compilation rules
     */
    public getRegisteredRules(): CompilerRule[] {
        return [...this.rules];
    }
}
