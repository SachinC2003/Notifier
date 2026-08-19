import { NextResponse } from "next/server";
import { Notifier } from "notifier-sdk";

export async function POST() {
  const apiKey = process.env.NOTIFIER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "NOTIFIER_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  try {
    const notifier = new Notifier({
      apiKey,
      baseUrl: process.env.NOTIFIER_API_URL ?? "http://localhost:3000",
    });

    const result = await notifier.notifications.send({
      eventKey: "ORDER_PLACED",
      recipient: "+919309177650",
      channel: ["SMS"],
      data: {
        customerName: "Ansh",
        orderId: "ORD123",
        amount: 500,
      },
    });

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to send test SMS." },
      { status: 502 },
    );
  }
}