"use server"

import { z } from "zod"

const surveySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  productRating: z.string(),
  serviceRating: z.string(),
  recommendLikelihood: z.string(),
})

export async function submitSurvey(formData: FormData) {
  try {
    const validatedFields = surveySchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      productRating: formData.get("productRating"),
      serviceRating: formData.get("serviceRating"),
      recommendLikelihood: formData.get("recommendLikelihood"),
    })

    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.flatten().fieldErrors }
    }

    const data = validatedFields.data

    // In a real application, you would save this data to a database
    // For example:
    // await db.survey.create({ data });

    // You could also send the data to an external API
    // Example with fetch:

    // Replace the custom API URL with the specified local development server
    const response = await fetch("http://127.0.0.1:8000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to submit survey")
    }

    // Check if the response is 204 No Content
    if (response.status === 204) {
      console.log("Survey submitted successfully (204 No Content)")
      return { success: true }
    }

    // Only try to parse JSON if there's content to parse
    if (
      response.headers.get("content-length") !== "0" &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      const responseData = await response.json()
      console.log("Survey submitted successfully:", responseData)
      return { success: true, data: responseData }
    }

    console.log("Survey submitted successfully")
    return { success: true }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: { _form: ["An unexpected error occurred."] } }
  }
}
