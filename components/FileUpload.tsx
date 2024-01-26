import React, { useState } from "react";

import Icons from "@/components/Icons";
import { getDroppedFiles, humanFileSize } from "@/lib/utils";

export default function FileUploadReader({
  onSelect,
}: {
  onSelect: (file?: File) => void;
}) {
  const [file, setFile] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    setFile(file);
    onSelect(file);
    setFileInput(e.target);
  };

  const removeFile = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    setFile(null);
    onSelect(null);

    // Must reset the file input otherwise
    // selecting another file will not update the
    // component view
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    return false;
  };

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files = getDroppedFiles(e);
    if (files.length > 0) {
      const file = files[0];
      setFile(file);
      onSelect(file);
    }
  };

  return (
    <>
      <input
        id="file-upload"
        onChange={onFileChange}
        type="file"
        className="hidden"
      />
      <label htmlFor="file-upload">
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="rounded-md border p-4 cursor-pointer"
        >
          <div>
            {file ? (
              <div className="flex justify-between items-center space-x-6">
                <div>
                  <p className="text-sm whitespace-pre-wrap">{file.name}</p>
                  <p className="text-sm">{humanFileSize(file.size)}</p>
                </div>
                <Icons.remove className="h-4 w-4" onClick={removeFile} />
              </div>
            ) : (
              <>
                <p>Tap to select a file</p>
                <p className="text-sm">Or drop the file here</p>
              </>
            )}
          </div>
        </div>
      </label>
    </>
  );
}
