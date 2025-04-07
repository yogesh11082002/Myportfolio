"use client";

import Container from "@/components/layout/Container";

export default function Loading() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-950">
      <Container>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </Container>
    </div>
  );
}
