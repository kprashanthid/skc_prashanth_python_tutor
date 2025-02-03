import Header from "./components/Header";
import ChatWrapper from "./components/chatwrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="text-center p-6">
        <p className="text-lg">
          Learn Python with an AI-powered tutor. Ask questions and get instant
          help!
        </p>
      </div>
      <ChatWrapper />
    </main>
  );
}
