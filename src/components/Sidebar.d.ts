import React from "react";
interface SidebarProps {
    activeView: string;
    setActiveView: (view: any) => void;
}
declare function Sidebar({ activeView, setActiveView }: SidebarProps): React.ReactElement;
export default Sidebar;
