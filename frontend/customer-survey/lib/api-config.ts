// You can create a configuration file to centralize your API endpoints
export const API_ENDPOINTS = {
  SURVEY_SUBMISSION: process.env.NEXT_PUBLIC_SURVEY_API_URL || "/api/survey",
  FEEDBACK: process.env.NEXT_PUBLIC_FEEDBACK_API_URL || "/api/feedback",
  // Add more endpoints as needed
}
