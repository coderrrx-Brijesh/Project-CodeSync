import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const modelName = process.env.AZURE_OPENAI_MODEL_NAME!;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION!;

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  try {
    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      deployment,
      apiVersion,
    });

    // Filter out any messages with null content
    const validMessages = messages.filter(
      (msg: { role: string; content: string | null | undefined }) =>
        msg.content !== null && msg.content !== undefined
    );

    // Add the system message at the beginning
    const formattedMessages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that can answer questions and help with tasks.",
      },
      ...validMessages,
    ];

    const response = await client.chat.completions.create({
      messages: formattedMessages,
      max_completion_tokens: 100000,
      model: modelName,
    });

    console.log(response.choices[0].message.content);
    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}
