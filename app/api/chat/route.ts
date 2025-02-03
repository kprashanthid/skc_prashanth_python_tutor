import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    console.log("API Key:", process.env.HUGGING_FACE_API_KEY);
    const { message } = await req.json();
    const apiKey = process.env.HUGGING_FACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const modelUrl =
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    const payload = {
      inputs: {
        text: message,
        past_user_inputs: [],
        generated_responses: [],
      },
    };

    // Initial request
    let response = await axios.post(modelUrl, payload, { headers });

    // Handle model loading with retries
    let retries = 0;
    while (response.status === 503 && retries < 3) {
      const estimatedTime = response.data.estimated_time || 10;
      console.log(
        `Model loading - retrying in ${estimatedTime}s (attempt ${
          retries + 1
        }/3)`
      );
      await new Promise((resolve) => setTimeout(resolve, estimatedTime * 1000));
      response = await axios.post(modelUrl, payload, { headers });
      retries++;
    }

    console.log(
      "Full Hugging Face Response:",
      JSON.stringify(response.data, null, 2)
    );

    if (!response.data?.generated_text) {
      return NextResponse.json(
        { response: "I couldn't understand that. Could you rephrase?" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      response: response.data.generated_text,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { response: "I'm having trouble connecting. Please try again later." },
      { status: 200 }
    );
  }
}
