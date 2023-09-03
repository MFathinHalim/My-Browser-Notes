const { useState, useEffect, useRef } = React;

function App() {
  const [notes, setNotes] = useState([]);
  const [quoteBlock, setQuoteBlock] = useState([]);
  const [selectedType, setSelectedType] = useState("notes");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    let mockNotes = [
      { id: 1, title: "Catatan 1", content: "Ini adalah catatan pertama.", type: "notes", done: false },
      { id: 2, title: "Catatan 2", content: "Ini adalah catatan kedua.", type: "notes", done: false },
      { id: 3, title: "Catatan 3", content: "Ini adalah catatan ketiga.", type: "notes", done: false },
    ];

    if (localStorage.getItem("user") !== null) {
      mockNotes = JSON.parse(localStorage.getItem("user"));

      mockNotes = mockNotes.map((note) => ({
        ...note,
        type: note.type !== null ? note.type : "notes",
        done: note.done !== undefined ? note.done : false,
      }));
    } else {
      localStorage.setItem("user", JSON.stringify(mockNotes));
    }

    setNotes(mockNotes);

    // Set mock quote
    const mockQuote = {
      id: 1,
      quote:
        "Semua orang memiliki Mimpi yang indah, tapi tidak semua memiliki cara yang mudah 🚀",
      author: "M.Fathin Halim",
    };

    setQuoteBlock([mockQuote]);
  }, []);
  useEffect(() => {
    // Apply dark mode to the HTML body
    document.body.classList.toggle("bg-dark", isDarkMode);
    document.body.classList.toggle("text-white", isDarkMode);
    

    document.getElementById("root").classList.toggle("bg-dark", isDarkMode);
    document.getElementById("root").classList.toggle("text-white", isDarkMode);
    // Store the dark mode preference in localStorage
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);


  function DeleteNotes(noteId) {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    localStorage.setItem("user", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  }

  function EditNotes(noteId, updatedTitle, updatedContent) {
    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? { ...note, title: updatedTitle, content: updatedContent }
        : note
    );
    localStorage.setItem("user", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  }
  function DoneNotes(noteId, updatedTitle, updatedContent) {
    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? { ...note, done: true }
        : note
    );
    localStorage.setItem("user", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  }
  function UndoneNotes(noteId, updatedTitle, updatedContent) {
    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? { ...note, done: false }
        : note
    );
    localStorage.setItem("user", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  }

  const handleDeleteNote = (noteId) => {
    DeleteNotes(noteId);
  };

  const handleEditNote = (noteId, updatedTitle, updatedContent) => {
    EditNotes(noteId, updatedTitle, updatedContent);
  };
  const handleDoneNote = (noteId, updatedTitle, updatedContent) => {
    DoneNotes(noteId, updatedTitle, updatedContent);
  };
  const handleUndoneNote = (noteId, updatedTitle, updatedContent) => {
    UndoneNotes(noteId, updatedTitle, updatedContent);
  };

  const handleAddNote = (newTitle, newContent) => {
    if (newTitle && newContent) {
      const newNote = {
        id: notes.length + 1,
        title: newTitle,
        content: newContent,
        type: selectedType,
        done: false,
      };

      const updatedNotes = [...notes, newNote];
      localStorage.setItem("user", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      localStorage.setItem("darkMode", newDarkMode);
      return newDarkMode;
    });
  };

  return (
    <div className={`container ${isDarkMode ? "bg-dark text-white" : ""} mt-4`}>
      <div className="text-center mb-3">
        <h1><i className="fas fa-clipboard"></i> My Browser Notes</h1>
      </div>
      <div className="text-center mb-3">
        {quoteBlock.map((quote) => (
          <div key={quote.id} className="blockquote">
            <p className="mb-0 m-1">{quote.quote}</p>
            <footer className="blockquote-footer m-1">{quote.author}</footer>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap justify-content-center">
        {notes.map((note) => (
          <Card
            key={note.id}
            noteId={note.id}
            noteTitle={note.title}
            noteContent={note.content}
            noteType={note.type}
            noteDone={note.done}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
            onDone={handleDoneNote}
            onUndone={handleUndoneNote}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
      <div className="text-center mt-3">
        <article className={`card card-body m-2 ${isDarkMode ? "bg-dark text-white" : ""}`} style={{ boxShadow: isDarkMode ? "0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.3)" : "" }}>
          <NewPostComponent onAdd={handleAddNote} selectedType={selectedType} setSelectedType={setSelectedType} isDarkMode={isDarkMode} />
        </article>
        <button
  type="button"
  className={`btn ${isDarkMode ? "btn-light" : "btn-dark"}`}
  onClick={toggleDarkMode}
>
  <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"}`}></i> {isDarkMode ? "Toggle Light Mode" : "Toggle Dark Mode"}
</button>

      </div>


    </div>
  );
}

function Card({ noteId, noteTitle, noteContent, noteType, noteDone, onDelete, onEdit, onDone, onUndone, isDarkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(noteTitle);
  const [editedContent, setEditedContent] = useState(noteContent);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle && editedContent) {
      onEdit(noteId, editedTitle, editedContent);
      setIsEditing(false);
    }
  };

  const handleDone = () => {
    onDone(noteId);
  };
  const handleUndone = () => {
    onUndone(noteId);
  };

  return (
    <div className={`card m-2 ${isDarkMode ? "bg-dark text-white" : ""}`} style={{ width: "18rem", boxShadow: isDarkMode ? "0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.3)" : "" }}>
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              className={`form-control mb-1 ${isDarkMode ? "bg-dark text-white" : ""}`}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className={`form-control mb-2 ${isDarkMode ? "bg-dark text-white" : ""}`}
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <button className={`btn btn-primary mr-2 `} onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <>
            <h5 className="card-title">{noteTitle}</h5>
            <p className="card-text">{noteContent}</p>
            {noteType === "notes" && (
              <>
                <button
                  className={`btn btn-danger mr-2 m-1 `}
                  onClick={() => onDelete(noteId)}
                >
                  <i className="fas fa-trash"></i>
                </button>
                <button className={`btn btn-secondary m-1 `} onClick={handleEdit}>
                  <i className="fas fa-pen-to-square"></i> Edit
                </button>
              </>
            )}
            {noteType === "todo" && noteDone === false && (
              <>
                <button
                  className={`btn btn-danger mr-2 m-1 `}
                  onClick={() => onDelete(noteId)}
                >
                  <i className="fas fa-trash"></i>
                </button>
                <button className={`btn btn-secondary m-1 `} onClick={handleEdit}>
                  <i className="fas fa-pen-to-square"></i> Edit
                </button>
                <button className={`btn btn-success m-1 `} onClick={handleDone}>
                  <i className="fas fa-check"></i> Done
                </button>
              </>
            )}
            {noteType === "todo" && noteDone === true && (
              <>
                <button
                  className={`btn btn-danger mr-2 m-1 `}
                  onClick={() => onDelete(noteId)}
                >
                  <i className="fas fa-trash"></i>
                </button>
                <button className={`btn btn-secondary m-1 `} onClick={handleEdit}>
                  <i className="fas fa-pen-to-square"></i> Edit
                </button>
                <button className={`btn btn-warning m-1 `} onClick={handleUndone}>
                  <i className="fas fa-xmark"></i> Undone
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function NewPostComponent({ onAdd, selectedType, setSelectedType, isDarkMode }) {
  const titleInput = useRef(null);
  const contentInput = useRef(null);

  const handleAddNote = (event) => {
    event.preventDefault();

    const newTitle = titleInput.current.value;
    const newContent = contentInput.current.value;

    if (newTitle && newContent) {
      onAdd(newTitle, newContent);
      titleInput.current.value = "";
      contentInput.current.value = "";
    }
  };

  return (
    <form className={`p-1 rounded-lg ${isDarkMode ? "bg-dark text-white" : ""}`}>
      <div className="form-group m-1">
        <label htmlFor="title">Title Notes</label>
        <input
          className={`form-control ${isDarkMode ? "bg-dark text-white" : ""}`}
          id="title"
          placeholder="Enter Title"
          ref={titleInput}
        />
      </div>
      <div className="form-group m-1">
        <label htmlFor="content">Content Notes</label>
        <textarea
          className={`form-control ${isDarkMode ? "bg-dark text-white" : ""}`}
          id="content"
          placeholder="Content"
          ref={contentInput}
        />
      </div>

      <div className="btn-group" role="group" aria-label="Note Type">
        <label className={`btn btn-warning `}>
          <input
            type="radio"
            value="notes"
            name="noteType"
            checked={selectedType === "notes"}
            onChange={() => setSelectedType("notes")}
          />
          Notes <i className="fas fa-clipboard"></i>
        </label>
        <label className={`btn btn-success `}>
          <input
            type="radio"
            value="todo"
            name="noteType"
            checked={selectedType === "todo"}
            onChange={() => setSelectedType("todo")}
          />
          To Do <i className="fas fa-pen-to-square"></i>
        </label>
      </div>
      <button
        type="submit"
        className={`btn btn-primary m-1 `}
        onClick={handleAddNote}
      >
        Tambah
      </button>
    </form>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
