import { convertToBase64, convertToBase64Attachment } from './files'

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
 * Read multiple files as attachments and push into state
 */
export async function handleFileAttachments(setAttachments, e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const converted = await Promise.all(
        files.map(f => convertToBase64Attachment(f))
    )
    setAttachments(prev => [...prev, ...converted])
    e.target.value = ''
}
