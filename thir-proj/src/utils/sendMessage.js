import { generateClient } from 'aws-amplify/api';
import { createConversation } from '../graphql/mutations';

const client = generateClient();

export const sendMessageToGraphQL = async (text, sender) => {
  try {
    await client.graphql({
      query: createConversation,
      variables: {
        input: {
          message: text,
          sender,
          timestamp: new Date().toISOString(),
        },
      },
    });
    console.log(`[${sender}] message saved`);
  } catch (error) {
    console.error('GraphQL save error:', error);
  }
};
