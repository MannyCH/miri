import React, { useRef, useState } from 'react';
import { parseRecipeTxt } from '../../lib/recipeParser';
import { compressImageToDataUrl } from '../../lib/recipeParser';
import { createRecipe } from '../../lib/recipesApi';
import { Button } from '../Button/Button';
import './BatchImportSection.css';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif']);

function baseName(file) {
  const name = file.name;
  const dotIndex = name.lastIndexOf('.');
  return dotIndex > 0 ? name.slice(0, dotIndex).toLowerCase() : name.toLowerCase();
}

function extension(file) {
  const name = file.name;
  const dotIndex = name.lastIndexOf('.');
  return dotIndex > 0 ? name.slice(dotIndex + 1).toLowerCase() : '';
}

/**
 * Groups files from a webkitdirectory selection into pairs:
 * { base: string, txtFile: File, imageFile: File | null }
 */
function pairFiles(fileList) {
  const txtFiles = [];
  const imageByBase = {};

  for (const file of fileList) {
    const ext = extension(file);
    if (ext === 'txt') {
      txtFiles.push(file);
    } else if (IMAGE_EXTENSIONS.has(ext)) {
      const base = baseName(file);
      // Keep first image match per base name
      if (!imageByBase[base]) imageByBase[base] = file;
    }
  }

  return txtFiles.map((txt) => ({
    base: baseName(txt),
    txtFile: txt,
    imageFile: imageByBase[baseName(txt)] ?? null,
  }));
}

const STATUS = { IDLE: 'idle', RUNNING: 'running', DONE: 'done' };

export function BatchImportSection({ onRecipeImported }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState(0);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? []);
    const pairs = pairFiles(files);

    if (pairs.length === 0) {
      setStatus(STATUS.DONE);
      setTotal(0);
      setDone(0);
      setFailed(0);
      return;
    }

    setTotal(pairs.length);
    setDone(0);
    setFailed(0);
    setStatus(STATUS.RUNNING);

    let successCount = 0;
    let failCount = 0;

    for (const { txtFile, imageFile } of pairs) {
      try {
        const text = await txtFile.text();
        const recipe = parseRecipeTxt(text);

        let image = null;
        let thumbnail = null;
        if (imageFile) {
          [image, thumbnail] = await Promise.all([
            compressImageToDataUrl(imageFile),
            compressImageToDataUrl(imageFile, 200, 0.7),
          ]);
        }

        const id = await createRecipe({ ...recipe, image, thumbnail });

        onRecipeImported?.({
          ...recipe,
          id,
          image,
          thumbnail,
          directions: recipe.directions ?? [],
          ingredients: recipe.ingredients ?? [],
        });

        successCount++;
      } catch {
        failCount++;
      }

      setDone(successCount);
      setFailed(failCount);
    }

    setStatus(STATUS.DONE);
    // Reset file input so the same folder can be re-selected if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleReset = () => {
    setStatus(STATUS.IDLE);
    setTotal(0);
    setDone(0);
    setFailed(0);
  };

  return (
    <div className="batch-import-section">
      <input
        ref={inputRef}
        type="file"
        // webkitdirectory lets the user pick a whole folder
        webkitdirectory=""
        multiple
        accept=".txt,image/*"
        className="batch-import-input"
        aria-label="Select folder to import recipes from"
        onChange={handleFiles}
      />

      {status === STATUS.IDLE && (
        <div className="batch-import-row">
          <p className="text-body-base-regular batch-import-description">
            Select a folder with <code>.txt</code> recipe files. Images with the same filename will be matched automatically.
          </p>
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            Choose folder
          </Button>
        </div>
      )}

      {status === STATUS.RUNNING && (
        <div className="batch-import-progress">
          <div className="batch-import-progress-bar">
            <div
              className="batch-import-progress-fill"
              style={{ width: `${total > 0 ? ((done + failed) / total) * 100 : 0}%` }}
            />
          </div>
          <p className="text-body-base-regular batch-import-status-text">
            Importing {done + failed} of {total}…
          </p>
        </div>
      )}

      {status === STATUS.DONE && (
        <div className="batch-import-result">
          {total === 0 ? (
            <p className="text-body-base-regular" style={{ color: 'var(--color-text-weak)' }}>
              No recipe files found in that folder.
            </p>
          ) : (
            <p className="text-body-base-regular">
              <span className="batch-import-count-success">{done} imported</span>
              {failed > 0 && (
                <span className="batch-import-count-failed"> · {failed} failed</span>
              )}
            </p>
          )}
          <Button variant="secondary" onClick={handleReset}>
            Import another folder
          </Button>
        </div>
      )}
    </div>
  );
}

BatchImportSection.displayName = 'BatchImportSection';
