const { useState, useEffect, useRef } = React;

function App() {
  const [notes, setNotes] = useState([]);
  const [quoteBlock, setQuoteBlock] = useState([]);

  useEffect(() => {
    let mockNotes = [
      { id: 1, title: "Catatan 1", content: "Ini adalah catatan pertama." },
      { id: 2, title: "Catatan 2", content: "Ini adalah catatan kedua." },
      { id: 3, title: "Catatan 3", content: "Ini adalah catatan ketiga." },
    ];

    if (localStorage.getItem("user") !== null) {
      mockNotes = JSON.parse(localStorage.getItem("user"));
    } else {
      localStorage.setItem("user", JSON.stringify(mockNotes));
    }

    setNotes(mockNotes);

    // Set mock quote
    const mockQuote = {
      id: 1,
      quote:
        "Semua orang memiliki Mimpi yang indah, tapi tidak semua memiliki cara yang mudah",
      author: "M.Fathin Halim",
    };

    setQuoteBlock([mockQuote]);
  }, []);

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

  const handleDeleteNote = (noteId) => {
    DeleteNotes(noteId);
  };

  const handleEditNote = (noteId, updatedTitle, updatedContent) => {
    EditNotes(noteId, updatedTitle, updatedContent);
  };

  const handleAddNote = (newTitle, newContent) => {
    if (newTitle && newContent) {
      const newNote = {
        id: notes.length + 1, // Generate a new unique ID for the new note
        title: newTitle,
        content: newContent,
      };

      const updatedNotes = [...notes, newNote];
      localStorage.setItem("user", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-3">
        <h1>My Browser Notes</h1>
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
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
          />
        ))}
      </div>
      <div className="text-center mt-3">
        <article className="card card-body">
          <NewPostComponent onAdd={handleAddNote} />
        </article>
      </div>
    </div>
  );
}

function Card({ noteId, noteTitle, noteContent, onDelete, onEdit }) {
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

  return (
    <div className="card m-2 shadow" style={{ width: "18rem" }}>
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              className="form-control mb-1"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <button className="btn btn-primary mr-2" onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <>
            <h5 className="card-title">{noteTitle}</h5>
            <p className="card-text">{noteContent}</p>
            <button
              className="btn btn-danger mr-2 m-1"
              onClick={() => onDelete(noteId)}>
              Delete
            </button>
            <button className="btn btn-secondary m-1" onClick={handleEdit}>
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function NewPostComponent({ onAdd }) {
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
    <form className="p-1 rounded-lg">
      <div className="form-group m-1">
        <label htmlFor="title">Title Notes</label>
        <input
          className="form-control"
          id="title"
          placeholder="Enter Title"
          ref={titleInput}
        />
      </div>
      <div className="form-group m-1">
        <label htmlFor="content">Content Notes</label>
        <textarea
          className="form-control"
          id="content"
          placeholder="Content"
          ref={contentInput}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary m-1"
        onClick={handleAddNote}>
        Tambah
      </button>
    </form>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
