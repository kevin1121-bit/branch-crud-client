import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createContext, useContext } from "react";
import { createUploadLink } from "apollo-upload-client";

const ApolloContext = createContext<any>(null);

export function useApollo() {
  return useContext(ApolloContext);
}

export default function ContextApollo(props: any) {
  const uploadLink = createUploadLink({
    uri: `${process.env.REACT_APP_KEY_URL_BACKEND}/graphql`,
  });

  const client = new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloContext.Provider value={client}>
      <ApolloProvider client={client}>{props.children}</ApolloProvider>
    </ApolloContext.Provider>
  );
}
