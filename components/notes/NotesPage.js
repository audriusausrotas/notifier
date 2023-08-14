"use client";

import Image from "next/image";
import Button from "@components/components/Button";
import NoteElement from "./NoteElement";
import { useState } from "react";

export default function NotesPage({ setShowNew, categories }) {
  const [selectedFilter, setSelectedFilter] = useState(categories[0]);

  return (
    <>
      <div className="notes__filters">
        {categories.map((item, index) => (
          <Button
            key={index}
            variant="filters"
            selected={selectedFilter === item ? true : false}
            onclick={() => {
              setSelectedFilter(item);
            }}
          >
            {item.includes("Manage") && (
              <Image
                src="/icons/folderadd.svg"
                alt="category icon"
                width={24}
                height={24}
                className="notes__icon"
              />
            )}
            {item}
          </Button>
        ))}
      </div>

      <Button variant="default" onclick={setShowNew}>
        <Image src="/icons/plus.svg" alt="plus" width={24} height={24} />
        Add New
      </Button>

      <div>
        <NoteElement />
      </div>
    </>
  );
}
