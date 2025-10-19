import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";
import { apolloClient } from "./lib/apollo-client";

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <App />
    <Toaster position="top-right" richColors />
  </ApolloProvider>
);
