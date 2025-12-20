import { useState } from "react";
import noteService from "../services/notes";

//passing in setNotes seems iffy
const UrlSearchBar = ({ setNotes }) => {
  const [url, setUrl] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    const notes = await noteService.getPublicByUrl(url);
    setNotes(notes);

    // setUrl('')
  };

  return (
    <div>
      <h3>Search comments by URL</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={url}
          name="search"
          onChange={({ target }) => setUrl(target.value)}
        />

        <button type="submit">search</button>
      </form>
    </div>
  );
};

export default UrlSearchBar;
