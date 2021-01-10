import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const httpLink = createHttpLink({
  uri: process.env.graphqlHttpEndPoint,
});

const wsLink = new WebSocketLink({
  uri: process.env.graphqlWsEndpoint || '',
  options: {
    reconnect: true,
  },
});

const cache = new InMemoryCache();

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link,
  cache,
});

export default apolloClient;
