import { CustomMutatorDefs } from '@rocicorp/zero';

import { schema } from './schema';

export type MessageInsertPayload = {
  id: string;
  senderID: string;
  mediumID: string;
  body: string;
  timestamp: number;
};

export function createMutators() {
  return {
    message: {
      insert: async (tx, payload: MessageInsertPayload) => {
        console.log(tx.reason);

        tx.mutate.message.insert(payload);
      },
    },
  } as const satisfies CustomMutatorDefs<typeof schema>;
}

export type Mutators = ReturnType<typeof createMutators>;
