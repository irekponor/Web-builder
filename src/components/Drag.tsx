import { useState } from "react";

type ComponentType = "text" | "image" | "button";

interface ElementType {
  id: number;
  type: ComponentType;
  content?: string;
  src?: string;
  label?: string;
}

const components: { type: ComponentType; label: string }[] = [
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
  { type: "button", label: "Button" },
];

export default function DragDropBuilder() {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [selected, setSelected] = useState<ElementType | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("componentType") as ComponentType;

    if (type) {
      const newElement: ElementType = {
        id: Date.now(),
        type,
        content: type === "text" ? "Edit me" : "",
        src: type === "image" ? "https://via.placeholder.com/150" : "",
        label: type === "button" ? "Click me" : "",
      };
      setElements([...elements, newElement]);
    } else if (dragIndex !== null) {
      const newIndex = parseInt(
        e.currentTarget.getAttribute("data-index") || "",
        10
      );
      if (!isNaN(newIndex) && newIndex !== dragIndex) {
        const updated = [...elements];
        const [dragged] = updated.splice(dragIndex, 1);
        updated.splice(newIndex, 0, dragged);
        setElements(updated);
      }
      setDragIndex(null);
    }
  };

  const updateElement = (id: number, updates: Partial<ElementType>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const deleteElement = (id: number) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selected?.id === id) {
      setSelected(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      <div className="bg-purple-700 p-4 rounded-xl">
        <h2 className="text-white font-bold mb-7">Elements</h2>
        {components.map((comp) => (
          <div
            key={comp.type}
            className="outline-2 outline-amber-100 text-white p-2 rounded shadow cursor-move mb-7"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", comp.type);
            }}
          >
            {comp.label}
          </div>
        ))}
      </div>

      <div
        className="bg-white border rounded-xl p-4 overflow-auto min-h-[80vh]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2 className="text-center text-gray-400 mb-4">
          Drop your elements here
        </h2>
        {elements.map((el, index) => (
          <div
            key={el.id}
            className={`border p-2 my-2 cursor-pointer ${
              selected?.id === el.id ? "bg-blue-100" : ""
            }`}
            data-index={index}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => setSelected(el)}
          >
            {el.type === "text" && <p>{el.content}</p>}
            {el.type === "image" && (
              <img src={el.src} alt="Dropped" className="w-full max-w-xs" />
            )}
            {el.type === "button" && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                {el.label}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-purple-700 p-4 rounded-xl">
        <h2 className="text-white font-bold mb-4">Edit elements</h2>
        {selected ? (
          <div className="space-y-4">
            {selected.type === "text" && (
              <input
                className="w-full p-2 border rounded"
                value={selected.content}
                onChange={(e) =>
                  updateElement(selected.id, { content: e.target.value })
                }
              />
            )}
            {selected.type === "image" && (
              <input
                className="w-full p-2 border rounded"
                value={selected.src}
                onChange={(e) =>
                  updateElement(selected.id, { src: e.target.value })
                }
              />
            )}
            {selected.type === "button" && (
              <input
                className="w-full p-2 border rounded"
                value={selected.label}
                onChange={(e) =>
                  updateElement(selected.id, { label: e.target.value })
                }
              />
            )}
            <button
              className="text-sm text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-100"
              onClick={() => deleteElement(selected.id)}
            >
              Delete Element
            </button>
          </div>
        ) : (
          <p className="text-white">Click on an element to edit or delete it</p>
        )}
      </div>
    </div>
  );
}
