"use client";
import { useRouter } from "next/navigation";
import Header from "./components/Header";

export default function Home() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push("./chat-page");
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg text-center mt-8">
        <h1 className="text-3xl font-bold text-blue-600">AI Python Tutor</h1>
        <p className="text-gray-700 mt-4">
          Welcome to AI Python Tutor, an interactive learning platform designed
          to teach Python programming to children in a fun and engaging way. Our
          AI-powered chatbot provides real-time assistance, interactive
          exercises, and personalized feedback to make coding easy and enjoyable
          for young learners.
        </p>
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-gray-800">Key Features:</h2>
          <ul className="mt-2 space-y-2">
            {[
              "AI-Powered Python Assistance",
              "Child-Friendly Learning Interface",
              "Interactive Code Exercises",
              "Real-Time Feedback and Guidance",
            ].map((feature, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleStartLearning}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Learning
        </button>
      </div>
    </main>
  );
}
