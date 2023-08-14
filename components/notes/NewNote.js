"use client";

import Image from "next/image";
import Button from "@components/components/Button";
import Categories from "@components/components/Categories";
import { useState } from "react";

export default function NewNote({ setShowNew, categories }) {
  const [showMenu, setShowMenu] = useState(false);
  const [title, setTitle] = useState("");
  const [newNote, setNewNote] = useState("");

  return (
    <div className="newNote">
      <div className="newNote__titlebar">
        <div className="newNote__titlebar--container">
          <Image
            src="/icons/close.svg"
            alt="close icon"
            width={24}
            height={24}
            onClick={() => {
              setShowNew(false);
            }}
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div
          className="newNote__titlebar--menu"
          onClick={() => {
            setShowMenu((prev) => !prev);
          }}
        >
          <Image
            src="/icons/menu.svg"
            alt="menu icon"
            width={24}
            height={6.3}
          />
          {showMenu && (
            <div className="newNote__titlebar--submenu">
              <Button variant="menu">
                <Image
                  src="/icons/save.svg"
                  alt="save icon"
                  width={24}
                  height={24}
                />
                <p>Save</p>
              </Button>
              <Button variant="menu">
                <Image
                  src="/icons/delete.svg"
                  alt="delete icon"
                  width={24}
                  height={24}
                />
                <p>Save</p>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="newNote__container">
        <div className="newNote__tagsbar">
          <Button variant="menu">
            <Image
              src="/icons/plus_blue.svg"
              alt="plus icon"
              width={18}
              height={18}
            />
            <p>Add Tags</p>
          </Button>
          <Categories categories={categories} />
        </div>
        <textarea
          placeholder="Add text here..."
          className="newNote__textArea"
          value={newNote}
          onChange={(e) => {
            setNewNote(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
