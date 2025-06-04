import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css'
import MailRow from "./components/MailRow";
import ToolBar from "./components/ToolBar";

// Placeholder for top menu
const TopMenuPlaceholder = () => (
    <div className="custom-navbar">Top menu</div>
);
// Placeholder for side menu
const SideMenuPlaceholder = () => (
    <div className="custom-sidenav">Side menu</div>
);

const DUMMY_EMAILS = [
    {
        id: "1",
        sender: "alice@example.com",
        subject: "Project update",
        snippet: "Here’s what we changed in v2.0...",
        date: "2025/06/04",
    },
    {
        id: "2",
        sender: "bob@work.org",
        subject: "Meeting reminder",
        snippet: "Don’t forget the team meeting at 9AM tomorrow.",
        date: "2025/06/03",
    },
    {
        id: "3",
        sender: "newsletter@site.com",
        subject: "Your daily digest",
        snippet: "Top tech news today: React 21.0 is out...",
        date: "2025/06/02",
    },
];

const MainPage = () => {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const allSelected = selectedIds.size === DUMMY_EMAILS.length;
    const anySelected = selectedIds.size > 0;


    const handleSelect = (id, isChecked) => {
        setSelectedIds((prev) => {
            const copy = new Set(prev);
            if (isChecked) copy.add(id);
            else copy.delete(id);
            return copy;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = DUMMY_EMAILS.map((mail) => mail.id);
            setSelectedIds(new Set(allIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleRefresh = () => {
        console.log(">> Refresh clicked");
        // TODO: re‐fetch from server, etc.
    };
    const handleDelete = () => {
        console.log(">> Deleting:", Array.from(selectedIds));
        // TODO: call API to delete or mark as deleted
        setSelectedIds(new Set()); // un‐select everything after “deletion”
    };
    const handleMarkAsRead = () => {
        console.log(">> Marking as Read:", Array.from(selectedIds));
        // TODO: call API to mark read/unread
        setSelectedIds(new Set()); // un‐select everything after marking as read
    };
    const handleMarkSpam = () => {
        console.log(">> Marking Spam:", Array.from(selectedIds));
        // TODO: call API to mark with blacklist
        setSelectedIds(new Set());
    };

    return (
        <div className="container-fluid p-3">
            {/* ---- TOP MENU ---- */}
            <div className="row mb-3">
                <div className="col-12">
                    <TopMenuPlaceholder/>
                </div>
            </div>
            {/* ---- MAIN LAYOUT ---- */}
            <div className="row">
                {/* ---- SIDE MENU ---- */}
                <div className="col-md-3 mb-3 custom-side-col">
                    <SideMenuPlaceholder/>
                </div>
                {/* ---- MAIL LIST CONTAINER ---- */}
                <div className="col-md-9 mb-3">
                    <div className="mail-container">
                        {/* ---- TOOLBAR ---- */}
                        <ToolBar
                            allSelected={allSelected}
                            anySelected={anySelected}
                            handleSelectAll={handleSelectAll}
                            handleRefresh={handleRefresh}
                            handleDelete={handleDelete}
                            handleMarkAsRead={handleMarkAsRead}
                            handleMarkSpam={handleMarkSpam}
                        />

                        {/* ---- ACTUAL MAIL ROWS ---- */}
                        {DUMMY_EMAILS.map((email) => (
                            <MailRow
                                key={email.id}
                                id={email.id}
                                sender={email.sender}
                                subject={email.subject}
                                body={email.snippet}
                                date={email.date}
                                isSelected={selectedIds.has(email.id)}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;