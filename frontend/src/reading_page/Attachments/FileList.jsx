import './FileList.css'

const FileList = ({files, theme}) => {

    return (
        <div className={`email-attachments ${theme}`}>
            {files.map((file, index) => (
                <a
                    key={index}
                    href={file.data}
                    download={file.name}
                    title={`Download ${file.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-thumb"
                >
                    <i className="bi bi-paperclip" style={{marginRight: '6px'}}></i>
                    <span className="file-name">{file.name}</span>
                </a>
            ))}
        </div>
    )
}

export default FileList;