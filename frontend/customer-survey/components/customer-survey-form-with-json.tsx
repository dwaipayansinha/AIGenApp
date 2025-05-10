"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Set the API URL to the specified local development server
const API_URL = "http://127.0.0.1:8000/submit"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  productRating: z.string().min(1, { message: "Please select a rating." }),
  serviceRating: z.string().min(1, { message: "Please select a rating." }),
  recommendLikelihood: z.string().min(1, { message: "Please select an option." }),
})

export default function CustomerSurveyFormWithJson() {
  // Rest of the component remains the same as in Option 2
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      productRating: "",
      serviceRating: "",
      recommendLikelihood: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    // Log the exact JSON that will be sent
    console.log("Sending JSON to backend:", JSON.stringify(values, null, 2))

    try {
      // Use the specified local development server URL
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      // Check if the response is 204 No Content
      if (response.status === 204) {
        console.log("Success: No content returned (204)")
        setIsSubmitted(true)
        return
      }

      // Only try to parse JSON if there's content to parse
      if (
        response.headers.get("content-length") !== "0" &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const data = await response.json()
        console.log("Success:", data)
      } else {
        console.log("Success: Response received but no JSON content")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold">Thank You!</h2>
            <p className="mb-6 text-muted-foreground">
              We appreciate you taking the time to provide your feedback. Your responses will help us improve our
              products and services.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>Submit Another Response</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            <p>Error: {error}</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="productRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How would you rate our product quality?</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className={`p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                            field.value === rating.toString() ? "text-yellow-500" : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(rating.toString())}
                        >
                          <Star
                            className="h-8 w-8"
                            fill={field.value === rating.toString() ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>1 = Poor, 5 = Excellent</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How would you rate our customer service?</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className={`p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                            field.value === rating.toString() ? "text-yellow-500" : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(rating.toString())}
                        >
                          <Star
                            className="h-8 w-8"
                            fill={field.value === rating.toString() ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>1 = Poor, 5 = Excellent</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendLikelihood"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How likely are you to recommend our products/services to others?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="very-likely" />
                        </FormControl>
                        <FormLabel className="font-normal">Very likely</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="somewhat-likely" />
                        </FormControl>
                        <FormLabel className="font-normal">Somewhat likely</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="neutral" />
                        </FormControl>
                        <FormLabel className="font-normal">Neutral</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="somewhat-unlikely" />
                        </FormControl>
                        <FormLabel className="font-normal">Somewhat unlikely</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="very-unlikely" />
                        </FormControl>
                        <FormLabel className="font-normal">Very unlikely</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
