import CustomerSurveyFormWithJson from "@/components/customer-survey-form-with-json"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Customer Satisfaction Survey</h1>
        <p className="text-muted-foreground text-center mb-8">
          We value your feedback! Please take a moment to complete this survey.
        </p>
        <CustomerSurveyFormWithJson />
      </div>
    </main>
  )
}
