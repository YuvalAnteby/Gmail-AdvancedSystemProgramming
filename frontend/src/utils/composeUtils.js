import { convertToBase64 } from './files'

/**
 * Wrap document.execCommand and re-focus the editor
 */
export function execCommand(editorRef, cmd, arg = null) {
    document.execCommand(cmd, false, arg)
    editorRef.current.focus()
}

/**
 * Read a file as dataURL and insert into editor
 */
export async function insertInlineImage(editorRef, e) {
    const file = e.target.files[0]
    if (!file) return
    const dataUrl = await convertToBase64(file)
    document.execCommand('insertImage', false, dataUrl)
    editorRef.current.focus()
    e.target.value = ''
}

/**
 * Handles file input and updates attachments list by using base64.
 * Rejects files larger than 5MB.
 *
 * @param {(attList: any[]) => void} setAttachments
 * @param {React.ChangeEvent<HTMLInputElement>} e
 */
export async function handleFileAttachments(setAttachments, e) {
    const files = Array.from(e.target.files || []);
    const MAX_SIZE_MB = 5;
    const validFiles = files.filter(f => f.size <= MAX_SIZE_MB * 1024 * 1024);

    const newAttachments = await Promise.all(
        validFiles.map(async file => {
            const base64 = await convertToBase64(file);
            return {
              name: file.name,
              data: base64
            };
        })
    );

    setAttachments(prev => [...prev, ...newAttachments]);

    const rejected = files.length - validFiles.length;
    if (rejected > 0) {
        alert(`${rejected} max file size is 5MB`);
    }
    // Optional: reset file input so same file can be re-attached if removed
    e.target.value = '';
}