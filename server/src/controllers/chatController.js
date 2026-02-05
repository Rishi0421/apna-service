import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Provider from "../models/Provider.js";
import { io } from "../server.js";

/* ================= GET MESSAGES ================= */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    let isParticipant =
      chat.user.toString() === req.user._id.toString() ||
      chat.provider.toString() === req.user._id.toString();

    if (!isParticipant) {
      const providerDoc = await Provider.findById(chat.provider).populate("user");
      if (
        providerDoc &&
        providerDoc.user &&
        providerDoc.user._id.toString() === req.user._id.toString()
      ) {
        isParticipant = true;
      }
    }

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("GET MSG ERROR:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

/* ================= SEND MESSAGE ================= */
export const sendMessage = async (req, res) => {
  try {
    const { chat, text } = req.body;

    if (!chat || !text?.trim()) {
      return res.status(400).json({ message: "Chat & message required" });
    }

    const chatDoc = await Chat.findById(chat);
    if (!chatDoc) {
      return res.status(404).json({ message: "Chat not found" });
    }

    let isParticipant =
      chatDoc.user.toString() === req.user._id.toString() ||
      chatDoc.provider.toString() === req.user._id.toString();

    if (!isParticipant) {
      const providerDoc = await Provider.findById(chatDoc.provider).populate("user");
      if (
        providerDoc &&
        providerDoc.user &&
        providerDoc.user._id.toString() === req.user._id.toString()
      ) {
        isParticipant = true;
      }
    }

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    const msg = await Message.create({
      chat: chatDoc._id,
      sender: req.user._id,
      text,
    });

    const populatedMsg = await msg.populate("sender", "name role");

    // 🔥 REAL-TIME PUSH
    io.to(chatDoc._id.toString()).emit("newMessage", populatedMsg);

    res.status(201).json(populatedMsg);
  } catch (err) {
    console.error("SEND MSG ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
