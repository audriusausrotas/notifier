"use client";

import SuccessElement from "@components/components/SuccessElement";
import { useState } from "react";
import NotesPage from "./NotesPage";
import NewNote from "./NewNote";

const CATEGORIES = ["All", "Project", "Personal", "Manage Category"];

export default function NotesMain() {
  const [showNew, setShowNew] = useState(true);

  return (
    <div className="notes">
      <div className="notes__title">
        <h2>Notes</h2>
        <SuccessElement text="New category is added successfully" />
      </div>

      {showNew ? (
        <NewNote setShowNew={setShowNew} categories={CATEGORIES} />
      ) : (
        <NotesPage setShowNew={setShowNew} categories={CATEGORIES} />
      )}
    </div>
  );
}
