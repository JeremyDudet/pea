/*
    The memory tool enables your LLM to store and retrieve information across conversations 
    through a memory file directory. Your LLM can create, read, update, and delete files 
    that persist between sessions, allowing it to build knowledge over time without keeping
    everything in the context window.  

    Memory = all sessions
    Session = all messages in a session
    Message = specific message in a specific session in Memory
*/

const FILE_PATH = "memory.json";

type Message = {
  role: string;
  content: string;
};

type Session = {
  messages: Message[];
};

// append new message to session
type AppendNewMessage = (
  newMessage: Message,
  sessionId: number,
) => Promise<void>;
export const appendNewMessage: AppendNewMessage = async (
  newMessage,
  sessionId,
) => {
  const memoryFile = Bun.file(FILE_PATH);
  const memory: Array<Session> = await memoryFile.json();
  const session: Session = memory[sessionId];
  const updatedSession = {
    messages: [...session.messages, newMessage],
  };

  await updateSession(sessionId, updatedSession);
};

// append new session to memory
type AppendNewSession = (newSession: Session) => Promise<void>;
export const appendNewSession: AppendNewSession = async (newSession) => {
  const memoryFile = Bun.file(FILE_PATH);
  const memory: Array<Session> = await memoryFile.json();
  memory.push(newSession);
  await Bun.write(FILE_PATH, JSON.stringify(memory, null, 2));
};

// read all memory
type ReadMemory = () => Promise<string>;
export const readMemory: ReadMemory = async () => {
  const memoryFile = Bun.file(FILE_PATH);
  const memory: Array<Session> = await memoryFile.json();
  return JSON.stringify(memory, null, 2);
};

// read a specific session
type FetchSession = (sessionId: number) => Promise<Session | undefined>;
export const fetchSession: FetchSession = async (sessionId) => {
  const memoryFile = Bun.file(FILE_PATH);
  const memory: Array<Session> = await memoryFile.json();
  return memory[sessionId];
};

// update a session
type UpdateSession = (sessionId: number, newSession: Session) => Promise<void>;
export const updateSession: UpdateSession = async (
  sessionId,
  newSessionValue,
) => {
  const memoryFile = Bun.file(FILE_PATH);
  const memory: Array<Session> = await memoryFile.json();
  const newMemory: Array<Session> = memory.with(sessionId, newSessionValue);
  await Bun.write(FILE_PATH, JSON.stringify(newMemory, null, 2));
};

// delete a session
type DeleteSession = (sessionId: number) => Promise<void>;
export const deleteSession: DeleteSession = async (sessionId) => {
  const removeItem = (array: any[], n: number) => {
    return array.filter((elem, i) => i !== n);
  };
  const memoryFile = Bun.file(FILE_PATH);
  const memory: Array<Session> = await memoryFile.json();
  const filteredMemory = removeItem(memory, sessionId);
  await Bun.write(FILE_PATH, JSON.stringify(filteredMemory, null, 2));
};

// ===== TESTS =====

const test = async () => {
  console.log("====== START TESTS =======");
  const dummySession = {
    messages: [
      {
        role: "system",
        content: "this is a test",
      },
      {
        role: "user",
        content: "hi there what is your name?",
      },
      {
        role: "ai",
        content: "this is just a test",
      },
    ],
  };
  console.log("------- Fetch Session 2 -------");
  console.log(await fetchSession(2));
  console.log("------- Append New Session -------");
  await appendNewSession(dummySession);
  console.log("------- Read All -------");
  console.log(await readMemory());
  console.log("------- Delete the second memory -------");
  await deleteSession(-1);
  console.log("------- Read All -------");
  console.log(await readMemory());
  console.log("------- Append new message to session 1 -------");
  const newMessage = {
    role: "user",
    content: "hey, this is a new message",
  };
  await appendNewMessage(newMessage, 1);
  console.log("------- Read All -------");
  console.log(await readMemory());
  console.log("------- Update Session index 3 -------");
  const newSession = {
    messages: [
      {
        role: "system",
        content: "this is the new session for session on index 3",
      },
    ],
  };
  await updateSession(3, newSession);
  console.log("------- Read All -------");
  console.log(await readMemory());
  console.log("======== END TESTS ==========");
};

test();

export const memoryTools = [
  {
    type: "function",
    function: {
      name: "readMemory",
      description: "Get the weather in a given city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "The city to get the weather for",
          },
        },
        required: ["city"],
      },
    },
  },
];
