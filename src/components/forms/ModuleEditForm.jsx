import React, { useState } from "react";

export default function ModuleEditForm({ module, onSave, onCancel }){

    //OBJECT to hold edited Values 
    const [form, setForm] = useState({
        title: module?.title || "",
        content: module?.content || "",
        textbook: module?.textbook || "",
        chapter: module?.chapter || "",
        rbt: module?.rbt || "",
    });

    //Assign values to respective form object when value changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //Saving edited Details Using PROPS Function
    const handleSubmit = () => {
        onSave(form);
    };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Module</h2>
      <div className="space-y-4">
        {/* Module Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Module Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Topics Covered
          </label>
          <textarea
            name="content"
            rows="4"
            value={form.content}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          ></textarea>
        </div>

        {/* Textbook */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Text Book No.
          </label>
          <input
            type="text"
            name="textbook"
            value={form.textbook}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Chapter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chapter Article No.
          </label>
          <input
            type="text"
            name="chapter"
            value={form.chapter}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* RBT */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            RBT Level(s)
          </label>
          <input
            type="text"
            name="rbt"
            value={form.rbt}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>

    </div>
  );
}
