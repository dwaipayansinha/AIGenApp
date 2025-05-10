import { NextResponse } from "next/server"
import { z } from "zod"

const surveySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  productRating: z.string(),
  serviceRating: z.string(),
  recommendLikelihood: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validatedFields = surveySchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json({ error: validatedFields.error.flatten().fieldErrors }, { status: 400 })
    }

    const data = validatedFields.data

    // In a real application, you would save this data to a database
    // For example:
    // await db.survey.create({ data });

    // You could also forward the data to another API
    // Example with fetch:
    /*
    const response = await fetch('https://your-api-endpoint.com/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit survey')
    }
    */

    console.log("Survey submitted successfully:", data)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
