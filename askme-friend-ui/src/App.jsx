import { useState, useEffect, useRef } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", text: "Hey! I'm your friendly AI. How can I help? 👋" }
  ]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const scrollRef = useRef(null);

  // reset browser spacing
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";
  }, []);

  // responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // auto scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        { role: "bot", text: data.reply }
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", text: "Error contacting backend 🔌" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.appShell}>
      {!isMobile && (
        <aside style={styles.sidebar}>
          <div>
            <div style={styles.logo}>🤖 askme-friend</div>

            <div style={styles.sidebarItem}>🕒 History</div>
            <div style={styles.sidebarItem}>🔍 Search</div>
          </div>

          <button style={styles.loginBtn}>Log In</button>
        </aside>
      )}

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Supercharge Your <span style={{ color: "#7c4dff" }}>Answers</span>
          </h1>
          <p style={styles.tagline}>
            One place to get your answers friendly ✨
          </p>
        </div>

        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <div style={styles.botIcon}>🤖</div>

            <div>
              <div style={{ fontWeight: "bold" }}>AskMe Bot</div>
              <div style={{ fontSize: "12px", color: "#2ecc71" }}>
                {loading ? "Typing..." : "Online"}
              </div>
            </div>
          </div>

          <div style={styles.messageList} ref={scrollRef}>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                style={
                  chat.role === "user"
                    ? styles.userBubble
                    : styles.botBubble
                }
              >
                {chat.role === "user" ? (
                  // User messages are usually plain text
                  chat.text
                ) : (
                  // Bot messages contain the HTML from your Python 'markdown' library
                  <div dangerouslySetInnerHTML={{ __html: chat.text }} />
                )}
              </div>
            ))}
          </div>

          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              value={message}
              placeholder="Type your message..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              style={styles.sendButton}
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  appShell: {
    display: "flex",
    height: "100vh",
    width: "100%",
    background: "#f7f8ff"
  },

  sidebar: {
    width: "240px",
    background: "white",
    borderRight: "1px solid #eee",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#7c4dff",
    marginBottom: "30px"
  },

  sidebarItem: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    color: "#555"
  },

  loginBtn: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#111",
    color: "white",
    cursor: "pointer"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px"
  },

  header: {
    textAlign: "center",
    marginBottom: "15px"
  },

  title: {
    color: "#777",
    fontSize: "30px",
    margin: "0"
  },

  tagline: {
    color: "#777",
    fontSize: "14px"
  },

  chatContainer: {
    width: "100%",
    maxWidth: "900px",
    flex: 1,
    background: "white",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid #eee"
  },

  chatHeader: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  botIcon: {
    width: "36px",
    height: "36px",
    background: "#7c4dff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  botBubble: {
    alignSelf: "flex-start",
    background: "#f2f2f7",
    padding: "12px 16px",
    borderRadius: "14px",
    maxWidth: "70%"
  },

  userBubble: {
    alignSelf: "flex-end",
    background: "#7c4dff",
    color: "white",
    padding: "12px 16px",
    borderRadius: "14px",
    maxWidth: "70%"
  },

  inputWrapper: {
    display: "flex",
    padding: "15px",
    gap: "10px",
    borderTop: "1px solid #eee"
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none"
  },

  sendButton: {
    width: "45px",
    borderRadius: "10px",
    border: "none",
    background: "#7c4dff",
    color: "white",
    cursor: "pointer"
  }
};

export default App;