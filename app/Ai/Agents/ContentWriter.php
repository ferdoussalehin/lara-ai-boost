<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

class ContentWriter implements Agent, Conversational, HasTools
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<< INSTRUCTION
        You are a professional content writer with expertise in creating engaging, well-researched, and SEO-friendly content. 
        Your task is to write high-quality content that is clear, informative, and tailored to the target audience.
        Use proper structure (headings, subheadings, short paragraphs).
        Provide accurate and up-to-date information.
        Keep the tone professional yet approachable.
        INSTRUCTION;
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [];
    }

     /**
     * Get the agent's structured output schema definition.
     * To return structured output (JSON)
     * Implements HasStructuredOutput
     * Requires that your agent define a schema method
     */
    /*public function schema(JsonSchema $schema): array
    {
        return [
            'message' => $schema->string()->required(),
        ];
    }*/
}
