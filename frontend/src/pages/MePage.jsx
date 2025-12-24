import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Note from "../components/Note";

const baseUrl = "http://localhost:3001/api/users"; //this is hardcoded; fix later

import { useSelector } from "react-redux";

import store from "../store";

const MePage = () => {
  const id = useParams().id;
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");

  const [notes, setNotes] = useState([])

  const onDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("token in store", store.getState().token);

        const config = {
          headers: {
            Authorization: store.getState().token,
          },
        };

        const response = await axios.get(`${baseUrl}/${id}`, config);
        console.log("user fetched", response.data);
        setUser(response.data);
        setNotes(response.data?.notes)
      } catch (error) {}
    };

    fetchUser();
  }, [id]);

  const handleFilterChange = (event) => {
    console.log("filter", event.target.value);
    setFilter(event.target.value);
  };

  const filteredNotes = notes.filter((note) => {
    switch (filter) {
      case "private":
        return note.private;
      case "public":
        return !note.private;
      case "all":
      default:
        return true;
    }
  });

  if (user) {
    return (
      <div>
        <div>username: {user.username}</div>
        <div>name: {user.name}</div>
        <div>note count: {user.notes.length} </div>
        <div>
          total like count:{" "}
          {user.notes.reduce((prev, curr) => prev + curr.likes, 0)}
        </div>

        <fieldset>
          <input
            type="radio"
            id="filterAll"
            name="filter"
            value="all"
            checked={filter === "all"}
            onChange={handleFilterChange}
          />
          <label htmlFor="filterAll">All</label>

          <input
            type="radio"
            id="filterPublic"
            name="filter"
            value="public"
            checked={filter === "public"}
            onChange={handleFilterChange}
          />
          <label htmlFor="filterPublic">Public</label>

          <input
            type="radio"
            id="filterPrivate"
            name="filter"
            value="private"
            checked={filter === "private"}
            onChange={handleFilterChange}
          />
          <label htmlFor="filterPrivate">Private</label>
        </fieldset>

        <div>notes:</div>
        {filteredNotes.map((note) => (
          <Note
            key={note.id}
            note={note}
            userId={user.id}
            showUsername={false}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return <div>loading...</div>;
};

export default MePage;
