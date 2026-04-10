import Anthropic from "@anthropic-ai/sdk";

export abstract class BaseAgent {
  protected client: Anthropic;
  abstract name: string;
  abstract model: string;
  abstract maxTokens: number;
  temperature: number = 0.7;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  abstract getSystemPrompt(
    context: unknown
  ): Anthropic.MessageCreateParams["system"];
  abstract getTools(): Anthropic.Tool[];
  abstract executeToolCall(
    toolName: string,
    toolInput: Record<string, unknown>
  ): Promise<unknown>;

  /**
   * Run the agent: send user message, handle tool use loop, return final text.
   */
  async generate(userMessage: string, context: unknown): Promise<string> {
    const tools = this.getTools();
    const systemPrompt = this.getSystemPrompt(context);

    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: userMessage },
    ];

    // Agentic loop: keep calling until we get a final text response
    let iterations = 0;
    const maxIterations = 15;

    while (iterations < maxIterations) {
      iterations++;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        tools,
        messages,
      });

      // Check if the response contains tool use blocks
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ContentBlock & { type: "tool_use" } =>
          block.type === "tool_use"
      );

      if (toolUseBlocks.length === 0 || response.stop_reason === "end_turn") {
        // No tool calls — extract and return text
        const textBlocks = response.content.filter(
          (block): block is Anthropic.TextBlock => block.type === "text"
        );
        return textBlocks.map((b) => b.text).join("\n");
      }

      // Add assistant response to messages
      messages.push({ role: "assistant", content: response.content });

      // Execute each tool call and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        try {
          const result = await this.executeToolCall(
            toolUse.name,
            toolUse.input as Record<string, unknown>
          );
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          });
        } catch (error) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            is_error: true,
            content:
              error instanceof Error ? error.message : "Unknown tool error",
          });
        }
      }

      // Add tool results as user message
      messages.push({ role: "user", content: toolResults });
    }

    throw new Error(
      `Agent ${this.name} exceeded maximum iterations (${maxIterations})`
    );
  }
}
