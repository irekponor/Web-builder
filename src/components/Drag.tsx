import { useState } from "react";

type ComponentType = "text" | "image" | "button";

interface ComponentOption {
  type: ComponentType;
  label: string;
}

interface ElementData {
  id: number;
  type: ComponentType;
  content?: string;
  src?: string;
  label?: string;
}

const components: ComponentOption[] = [
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
  { type: "button", label: "Button" },
];

export default function DragDropBuilder() {
  const [elements, setElements] = useState<ElementData[]>([]);
  const [selected, setSelected] = useState<ElementData | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("componentType") as ComponentType;

    const newElement: ElementData = {
      id: Date.now(),
      type,
      content: type === "text" ? "Edit me" : "",
      src: type === "image" ? "https://imagelink.com/150" : "",
      label: type === "button" ? "Click me" : "",
    };

    setElements([...elements, newElement]);
  };

  const updateElement = (id: number, updates: Partial<ElementData>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );

    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      <div className="bg-gray-100 p-4 rounded-xl">
        <h2 className="font-bold mb-4">Elements</h2>
        {components.map((comp) => (
          <div
            key={comp.type}
            className="bg-white p-2 rounded shadow cursor-move mb-2"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("componentType", comp.type)
            }
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
        <h2 className="text-center text-gray-400">Drop your elements here</h2>
        {elements.map((el) => (
          <div
            key={el.id}
            className="border p-2 my-2 cursor-pointer"
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

      <div className="bg-gray-50 p-4 rounded-xl">
        <h2 className="font-bold mb-4">Edit element</h2>
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
          </div>
        ) : (
          <p className="text-gray-400">Click on an element to edit it</p>
        )}
      </div>
    </div>
  );
}
