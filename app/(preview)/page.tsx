"use client";

import { useState } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { AnimatePresence, motion } from "framer-motion";
import {
  GitIcon,
  LogoAnthropic,
  LogoGoogle,
  LogoOpenAI,
  RouteIcon,
  VercelIcon,
} from "@/components/icons";
import Link from "next/link";
import { useChat } from "ai/react";
import { toast } from "sonner";

const suggestedActions = [
  {
    title: "Why is",
    label: "the sky blue?",
    action: "why is the sky blue?",
  },
  {
    title: "What does it mean",
    label: "to be in the arena?",
    action: "what does it mean to be in the arena?",
  },
];

const models = [
  "openai:gpt-4o",
  "anthropic:claude-3-sonnet-20240229",
  "google:gemini-1.5-flash",
];

const getProviderIcon = (model: string) => {
  const provider = model.split(":")[0];

  switch (provider) {
    case "openai":
      return <LogoOpenAI />;
    case "anthropic":
      return <LogoAnthropic />;
    case "google":
      return <LogoGoogle />;
    default:
      return null;
  }
};

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(
    "anthropic:claude-3-sonnet-20240229",
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { messages, handleSubmit, input, setInput, append } = useChat({
    body: {
      model: selectedModel,
    },
    onError: () => {
      toast.error("You have been rate limited, please try again later!");
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <VercelIcon size={16} />
                  <span>+</span>
                  <RouteIcon />
                </p>
                <p>
                  The experimental_createProviderRegistry function allows you to
                  create a registry of providers and models that you can can
                  switch between and use in your application.
                </p>
                <p>
                  {" "}
                  Learn more about the{" "}
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://sdk.vercel.ai/docs/reference/ai-sdk-core/provider-registry"
                    target="_blank"
                  >
                    Provider Registry{" "}
                  </Link>
                  from Vercel AI SDK.
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
            ></Message>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-row gap-2 relative items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0"
          onSubmit={handleSubmit}
        >
          <input
            className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />

          <div
            className="text-sm bg-zinc-100 rounded-lg size-9 flex-shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800"
            onClick={() => {
              setIsDropdownVisible(!isDropdownVisible);
            }}
          >
            {getProviderIcon(selectedModel)}
          </div>
        </form>
      </div>

      <AnimatePresence>
        {isDropdownVisible && (
          <>
            <motion.div
              className="z-40 fixed bg-zinc-900/50 h-dvh w-dvw top-0 left-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDropdownVisible(false);
              }}
            />

            <motion.div
              className="z-50 fixed top-0 right-0 w-dvw h-dvh p-4 flex flex-col gap-6 bg-white dark:bg-zinc-800"
              initial={{ y: "100%" }}
              animate={{ y: "50%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <div className="text-sm">Choose a Model</div>
              <div className="flex flex-col">
                {models.map((model) => {
                  return (
                    <div
                      key={model}
                      className={`flex flex-row gap-4 items-center hover:bg-zinc-100 dark:hover:bg-zinc-700 p-1.5 px-2 cursor-pointer rounded-lg ${
                        model === selectedModel
                          ? "bg-zinc-100 dark:bg-zinc-700"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedModel(model);
                        setIsDropdownVisible(false);
                      }}
                    >
                      <div className="">{getProviderIcon(model)}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {model.split(":")[1]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="z-10 flex flex-row gap-4 items-center justify-between fixed bottom-6 text-xs "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Link
          target="_blank"
          href="https://github.com/vercel-labs/ai-sdk-preview-provider-registry"
          className="flex flex-row gap-2 items-center border px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <GitIcon />
          View Source Code
        </Link>

        <Link
          target="_blank"
          href="https://vercel.com/templates/next.js/ai-sdk-provider-registry"
          className="flex flex-row gap-2 items-center bg-zinc-900 px-2 py-1.5 rounded-md text-zinc-50 hover:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-50"
        >
          <VercelIcon size={14} />
          Deploy with Vercel
        </Link>
      </motion.div>
    </div>
  );
}
