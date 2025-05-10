"use client"

import { useEffect, useState } from "react"

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState({
    recordsCount: null,
    averageProductRating: null,
    averageServiceRating: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await response.json()
        setMetrics(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return <div className="p-4">Error loading metrics: {error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Metrics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Records Count */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium mb-2">Total Records</div>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="text-2xl font-bold">{metrics.recordsCount?.toLocaleString() || "N/A"}</div>
          )}
          <div className="text-xs text-gray-500 mt-1">Total records in database</div>
        </div>

        {/* Product Rating */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium mb-2">Product Rating</div>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="text-2xl font-bold">
              {metrics.averageProductRating?.toFixed(1) || "N/A"}
              <span className="text-sm text-gray-500 ml-1">/5</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">Average product rating</div>
        </div>

        {/* Service Rating */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium mb-2">Service Rating</div>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="text-2xl font-bold">
              {metrics.averageServiceRating?.toFixed(1) || "N/A"}
              <span className="text-sm text-gray-500 ml-1">/5</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">Average service rating</div>
        </div>
      </div>
    </div>
  )
}
