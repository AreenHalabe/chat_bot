import { generateClient } from 'aws-amplify/api';
import { listConversations } from '../graphql/queries';

const client = generateClient();

export const fetchUserMessages = async () => {
  try {
    const res = await client.graphql({
      query: listConversations,
    });

    const messages = res.data.listConversations.items;

    // Sort by timestamp ascending
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};
