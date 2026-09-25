import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import Chat from "../../components/chat/Chat";

function MessagesPage() {
  const data = useLoaderData();

  return (
    <div className="min-h-[calc(100vh-72px)] flex bg-surface-50 p-4 md:p-6 lg:p-8">
      <div className="flex-1 bg-white rounded-card shadow-card border border-surface-200 overflow-hidden flex flex-col max-w-6xl mx-auto w-full h-[calc(100vh-120px)]">
        <div className="p-4 md:p-6 border-b border-surface-200 bg-navy-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-heading text-2xl font-bold">Messages</h1>
            <p className="font-body text-sm text-navy-200 mt-1">Connect with Buyers And Sellers.</p>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-xl">💬</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative">
          <Suspense fallback={<div className="p-8 text-center text-navy-400 flex items-center justify-center h-full">Loading chats...</div>}>
            <Await resolve={data.chatResponse} errorElement={<p className="p-8 text-red-500 flex items-center justify-center h-full">Error loading chats!</p>}>
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
