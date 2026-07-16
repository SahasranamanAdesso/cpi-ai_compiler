/**
 * AIProvider - Interface for AI/LLM providers
 *
 * This interface abstracts AI provider implementations (Claude, OpenAI, Gemini, etc.)
 * allowing the AI pipeline to remain provider-agnostic.
 *
 * Implementations are responsible ONLY for:
 * - Sending prompts to the LLM
 * - Receiving and returning the response
 *
 * Implementations must NOT:
 * - Generate XML, BPMN, or ZIP files
 * - Invoke the compiler
 * - Validate generated code (that's SDKValidator's job)
 * - Parse or transform the response
 *
 * The provider returns the raw LLM response as a string.
 *
 * @example
 * const provider: AIProvider = new ClaudeProvider(apiKey);
 * const response = await provider.generate(prompt);
 * // response = "const flow = new IFlow('MyFlow'); ..."
 */
export interface AIProvider {
    /**
     * Generates a response from the AI provider given a prompt
     *
     * @param prompt - The complete prompt to send to the LLM
     * @returns The raw response from the LLM as a string
     * @throws Error if the API call fails
     *
     * @example
     * const prompt = "Generate TypeScript code for an Integration Flow...";
     * const response = await provider.generate(prompt);
     */
    generate(prompt: string): Promise<string>;
}
